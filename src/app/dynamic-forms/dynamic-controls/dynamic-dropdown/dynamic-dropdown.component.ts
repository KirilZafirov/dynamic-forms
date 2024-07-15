


import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControlComponent } from '../base-dynamic-control/base-dynamic-control.component'; 
import { DropdownSelectComponent, SelectOption } from '../../../dropdown/dropdown-select.component';

@Component({
  selector: 'app-dynamic-dropdown',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownSelectComponent, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup"> 
           <div style="min-width: 250px;">
             <ng-template #dropdownTemplate let-item let-highlight="highlight">
                <strong>{{ item.displayValue }}</strong
               >({{ highlight }})
             </ng-template> 
           
             <dropdown-select
               [toStringFunction]="objectToStringFunction"
               [multiSelectEnabled]="control.config.multiSelectEnabled || false"
               [selectAllEnabled]="control.config.selectAllEnabled || false"
               [searchEnabled]="control.config.searchEnabled || false" 
               [items]="control.config.options || []"
               [formControlName]="control.controlKey"
               [itemTemplate]="dropdownTemplate"
               [maxHeight]="600"
               [placeholder]="'Select objects'"
               [searchMatchFunction]="objectSearchMatchFunction"
               [formFieldId]="control.controlKey"
               [noSelection]="'No selection'"
               [noSelectionAllowed]="false"        
             ></dropdown-select>
        </div>
    </ng-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicDropdownComponent extends BaseDynamicControlComponent   {
  
  public readonly objectToStringFunction = (item: any) => item?.name

  public objectSearchMatchFunction = (searchValue: string, item: SelectOption) => {
    return `${item.value.name}`.toLowerCase().includes(searchValue.toLowerCase());
  }; 

}
