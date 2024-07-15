import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbDropdown, NgbDropdownItem, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { startWith, Subject, Subscription, take, takeUntil } from 'rxjs';
import { SELECTED_ITEM_LIMIT, ITEM_LIMIT } from './helpers/item-limits';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { MoreSelectedOptionsPipe } from './pipes/more-selected-options.pipe';


export const deepCopy = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

export interface SelectOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  name: string;
  additionalOptions?: {
    [key: string]: unknown;
  };
  // only allow to go one level deep with subOptions
  subOptions?: Pick<SelectOption, 'value' | 'name' | 'additionalOptions'>[];
}

@Component({
  selector: 'dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
  imports: [JsonPipe, NgTemplateOutlet,NgbDropdownModule, NgbTooltipModule, MoreSelectedOptionsPipe, ReactiveFormsModule],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropdownSelectComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSelectComponent
  implements AfterViewInit, ControlValueAccessor, OnDestroy, OnChanges {
  private static COUNTER = 0;

  @Input() public readonly = false;
  @Input() public invalid = false;
  @Input() public disabled = false;
  @Input() public noSelectionAllowed = true;
  @Input() public formFieldId: string = 'dropdown-select__' + DropdownSelectComponent.COUNTER++;
  @Input() public itemTemplate!: TemplateRef<any>;
  @Input() public items: SelectOption[] = [];
  @Input() public initialSelection: SelectOption[] = [];
  @Input() public placeholder?: string;
  @Input() public noSelection?: string;
  // maxHeight or maxItems are mutually exclusive
  // if both are given, maxItems is used
  @Input()
  public set maxHeight(maxHeight: number) {
    this.originalMaxHeight = maxHeight;
  }

  @Input() public maxItems!: number;
  @Input() public searchEnabled = false;
  @Input() public multiSelectEnabled = false;
  @Input() public selectAllEnabled = false;
  @Input() public emptyname = 'Empty value';
  @Input() public selectedItemLimit = SELECTED_ITEM_LIMIT;
  @Output() public readonly selectionChange = new EventEmitter<any>();

  @ViewChild('search') public searchInput!: ElementRef;
  @ViewChild(NgbDropdown, { static: true }) private readonly ngbDropdown!: NgbDropdown;
  @ViewChildren(NgbDropdownItem) private readonly ngbDropdownItems!: QueryList<ElementRef>;

  public readonly itemLimit = ITEM_LIMIT;
  public selectedItems: SelectOption[] = [];
  public calculatedMaxHeight!: number;
  public touched = false;
  public dropdownOpen = false;
  public searchFormControl = new UntypedFormControl('');
  public availableItems!: SelectOption[];
  public allAreSelected = false;
  public itemsLimited = false;

  private readonly destroy$$ = new Subject<void>();

  private value: any;
  private originalMaxHeight!: number;
  private checkMaxHeightBasedOnDropdownItemListSubscription!: Subscription;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public toStringFunction: (name?: any, highlight?: string) => string | SafeHtml =
    (name?: any, highlight?: string) => {
      if (!name) {
        return '';
      }
      if (!highlight) {
        return `${name}`;
      }
      // match lowercase
      const regex = new RegExp(`(${highlight})`, 'gmi');
      let workingItem = `${name}`;
      const matches = workingItem.match(regex);
      matches?.forEach((match) => {
        workingItem = `${name}`.replace(match, `<em>${match}</em>`);
      });
      return this.#domSanitizer.bypassSecurityTrustHtml(workingItem);
    };
  @Input() public searchMatchFunction: (
    searchValue: string,
    selectOption: SelectOption,
  ) => boolean = (searchValue: string, selectOption: SelectOption) => {
    return `${selectOption.name}`.toLowerCase().includes(searchValue.toLowerCase());
  };

  @Input() public valueCompareFunction: (valueOne: any, valueTwo: any) => boolean = (
    valueOne: any,
    valueTwo: any,
  ) => {
    return valueOne === valueTwo;
  };
  #domSanitizer = inject(DomSanitizer)
  #changeDetectorRef = inject(ChangeDetectorRef)
  

  public ngAfterViewInit(): void {
    this.checkMaxHeightBasedOnDropdownItemList();
    this.setupSearch();
    this.ngbDropdown.openChange
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => this.handleToggle());
  }

  public ngOnChanges(simpleChanges: SimpleChanges): void {
    if (!simpleChanges['maxItems']?.firstChange) {
      this.checkMaxHeightBasedOnDropdownItemList();
    }
    if (simpleChanges['items']) {
      this.handleItemsChange();
      this.writeValue(this.value);
    }
    if (simpleChanges['initialSelection']) {
      this.writeValue(this.initialSelection.map((i) => i.value));
    }
  }

  public ngOnDestroy(): void {
    this.destroy$$.next();
  }

  @HostListener('document:keydown.escape', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    // console.log(event);
    // see side-detail component for problem with escape behavior
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (value: any): void => {
    // deliberately empty
  };

  public onTouched = (): void => {
    // deliberately empty
  };

  public handleClearSelection(): void {
    this.selectedItems = [];
    this.handleSelectedItemsChange();
    this.ngbDropdown.close();
  }

  public handleItemClick(item: SelectOption, group?: boolean, $event?: Event): void {
    // we have to find the original item because the object references are changed because of the deepcopy in the search
    const originalItem = this.findOriginalItem(item);

    if ($event) {
      $event.stopPropagation();
    }
    this.markAsTouched();
    if (!this.disabled) {
      if (this.multiSelectEnabled) {
        if (group) {
          const relevantSelectedItems = this.selectedItems.filter((selectedItem) => {
            return originalItem.subOptions?.includes(selectedItem);
          });
          // not all were selected before, so select all
          if (relevantSelectedItems?.length !== originalItem.subOptions?.length) {
            this.selectedItems = [
              ...this.selectedItems.filter(
                (selectedItem) => !relevantSelectedItems.includes(selectedItem),
              ),
              ...(originalItem.subOptions ?? []),
            ];
          } else {
            // all were selected before, so deselected
            this.selectedItems = [
              ...this.selectedItems.filter(
                (selectedItem) => !relevantSelectedItems.includes(selectedItem),
              ),
            ];
          }
        } else {
          if (this.selectedItems.includes(originalItem)) {
            this.selectedItems = [
              ...this.selectedItems.filter((selectedItem) => selectedItem !== originalItem),
            ];
          } else {
            this.selectedItems = [...this.selectedItems, originalItem];
          }
        }
      } else {
        this.selectedItems = [originalItem];
      }
      this.handleSelectedItemsChange();
    }
  }

  public writeValue(value: any): void {
    this.value = value;
    if (value === undefined || value === null) {
      this.selectedItems = [];
    } else {
      const selectedItems: SelectOption[] = [];
      if (Array.isArray(value)) {
        this.items.forEach((item) => {
          if (value.includes(item.value)) {
            selectedItems.push(item);
          }
          item.subOptions?.forEach((subOption) => {
            if (value.includes(subOption.value)) {
              selectedItems.push(subOption);
            }
          });
        });
      } else {
        this.items.forEach((items) => {
          if (items.value === value) {
            selectedItems.push(items);
          }
          items.subOptions?.forEach((subOption) => {
            if (subOption.value === value) {
              selectedItems.push(subOption);
            }
          });
        });
      }
      this.selectedItems = [...selectedItems];
      this.updateSearchValue();
    }
    this.#changeDetectorRef.detectChanges();
  }

  public registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  public markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.#changeDetectorRef.detectChanges();
  }

  public handleSearchKeyupEnter(): void {
    if (this.availableItems.length === 1) {
      this.handleItemClick(this.availableItems[0]);
      this.handleToggle();
    }
  }

  private handleToggle(): void {
    // TODO: more clever
    if (this.dropdownOpen) {
      this.ngbDropdown.close();
      this.dropdownOpen = false;
    } else {
      this.ngbDropdown.open();
      this.dropdownOpen = true;
      if (this.searchEnabled) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
          this.searchInput.nativeElement.select();
        });
      }
    }
  }

  public handleSelectAll(): void {
    this.markAsTouched();
    if (!this.disabled) {
      this.allAreSelected = !this.allAreSelected;
      if (this.allAreSelected) {
        const selectedItems: SelectOption[] = [];
        this.items.forEach((item) => {
          if (item.subOptions) {
            selectedItems.push(...item.subOptions);
          } else {
            selectedItems.push(item);
          }
        });
        this.selectedItems = [...selectedItems];
      } else {
        this.selectedItems = [];
      }
      this.handleSelectedItemsChange();
      this.ngbDropdown.close();
    }
  }

  public isSelectedItem(item: SelectOption, group?: boolean): boolean {
    // we have to find the original item because the object references are changed because of the deepcopy in the search
    const originalItem = this.findOriginalItem(item);
    if (group) {
      return (
        originalItem.subOptions?.length ===
        this.selectedItems.filter((selectedItem) => originalItem.subOptions?.includes(selectedItem))
          .length
      );
    } else {
      return this.selectedItems.includes(originalItem);
    }
  }

  private checkMaxHeightBasedOnDropdownItemList(): void {
    if (this.checkMaxHeightBasedOnDropdownItemListSubscription) {
      this.checkMaxHeightBasedOnDropdownItemListSubscription.unsubscribe();
    }
    this.checkMaxHeightBasedOnDropdownItemListSubscription = this.ngbDropdownItems?.changes
      .pipe(startWith(this.ngbDropdownItems), take(1), takeUntil(this.destroy$$))
      .subscribe((dropdownItemList) => {
        let searchHeight = 0;
        if (this.searchEnabled) {
          searchHeight = this.getElementHeight(this.searchInput.nativeElement);
        }
        let extraItems = 0;
        if (this.selectAllEnabled) {
          extraItems++;
        }
        if (
          this.noSelectionAllowed ||
          (this.multiSelectEnabled && this.selectedItems?.length !== 0)
        ) {
          extraItems++;
        }
        if (this.maxItems) {
          // potential select item with less or more height
          const firstHeight = this.getElementHeight(
            dropdownItemList.first.elementRef.nativeElement,
          );
          // height of potential element based on template
          const lastHeight = this.getElementHeight(dropdownItemList.last.elementRef.nativeElement);
          if (firstHeight !== lastHeight) {
            this.calculatedMaxHeight =
              (this.maxItems - 1 + extraItems) * lastHeight + firstHeight + searchHeight;
          } else {
            this.calculatedMaxHeight = (this.maxItems + extraItems) * lastHeight + searchHeight;
          }
        } else {
          this.calculatedMaxHeight = this.originalMaxHeight;
        }
      });
  }

  // We use this method to determine the height of an hidden element.
  // We clone it some outcorner of the app and make it hidden without sideeffects
  // This allows us to grab its full dimensions
  private getElementHeight(el: any): number {
    const clone = el.cloneNode(true);
    clone.style.cssText =
      'position: fixed; top: 0; left: 0; overflow: auto; visibility: hidden; pointer-events: none; height: unset; max-height: unset;';
    document.body.append(clone);
    const height = clone.getBoundingClientRect().height;
    clone.remove();
    return height;
  }

  private setupSearch(): void {
    this.searchFormControl.valueChanges
      .pipe(takeUntil(this.destroy$$))
      .subscribe((searchValue: string) => {
        this.handleItemsChange(searchValue);
      });
  }

  private handleItemsChange(searchValue?: string): void {
    if (this.items?.length > ITEM_LIMIT) {
      this.itemsLimited = true;
    }
    if (!searchValue) {
      this.availableItems = [...(this.itemsLimited ? this.items.slice(0, ITEM_LIMIT) : this.items)];
    } else {
      let copiedItems = deepCopy(this.items);
      copiedItems = [
        ...copiedItems
          .filter(
            (item) =>
              this.searchMatchFunction(searchValue, item) ||
              item.subOptions?.some((subOption) =>
                this.searchMatchFunction(searchValue, subOption),
              ),
          )
          .map((item) => {
            if (item.subOptions) {
              item.subOptions = [
                ...item.subOptions.filter((subOption) =>
                  this.searchMatchFunction(searchValue, subOption),
                ),
              ];
            }
            return item;
          })
          .filter((item) => {
            // filter out group values if multiselect not enabled
            return !(!this.multiSelectEnabled && item.subOptions && item.subOptions.length === 0);
          }),
      ];
      this.availableItems = [
        ...(this.itemsLimited ? copiedItems.slice(0, ITEM_LIMIT) : copiedItems),
      ];
    }
    this.#changeDetectorRef.detectChanges();
  }

  private handleSelectedItemsChange(): void {
    const mappedSelectedItems = this.selectedItems.map((item) => item.value);
    let returnValue = mappedSelectedItems[0] || undefined;
    if (this.multiSelectEnabled && mappedSelectedItems.length > 0) {
      returnValue = mappedSelectedItems;
    }
    this.selectionChange.emit(returnValue);
    this.onChange(returnValue);
    this.updateSearchValue();
    this.availableItems = [...(this.itemsLimited ? this.items.slice(0, ITEM_LIMIT) : this.items)];
    const realItems: SelectOption[] = [];
    this.items.forEach((item) => {
      if (item.subOptions) {
        realItems.push(...item.subOptions);
      } else {
        realItems.push(item);
      }
    });
    this.allAreSelected = this.selectedItems.length === realItems.length;
    this.checkMaxHeightBasedOnDropdownItemList();
    this.#changeDetectorRef.detectChanges();
  }

  private findOriginalItem(copiedItem: SelectOption): SelectOption {
    let originalItem: SelectOption;
    [...(this.itemsLimited ? this.items.slice(0, ITEM_LIMIT) : this.items)].forEach((item) => {
      if (this.valueCompareFunction(copiedItem.value, item.value)) {
        originalItem = item;
      } else if (item.subOptions) {
        item.subOptions.forEach((subOption) => {
          if (this.valueCompareFunction(copiedItem.value, subOption.value)) {
            originalItem = subOption;
          }
        });
      }
    });
    // Note: the original is guaranteed to be found
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return originalItem as SelectOption;
  }

  private updateSearchValue(): void {
    let newSearchValue: string | SafeHtml = '';
    if (!this.multiSelectEnabled) {
      newSearchValue = this.toStringFunction(this.selectedItems[0]?.name);
    }

    // set search and reset availableItems
    this.searchFormControl.setValue(newSearchValue, {
      emitEvent: false,
    });
  }
}
