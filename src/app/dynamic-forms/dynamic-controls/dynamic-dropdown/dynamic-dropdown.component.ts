


import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControlComponent } from '../base-dynamic-control/base-dynamic-control.component'; 
import { DropdownSelectComponent, SelectOption } from '../../../dropdown/dropdown-select.component';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownSelectComponent, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <!-- <input
        
        [value]="control.config.value"
        [id]="control.controlKey"
        [type]="control.config.type"> --> 
           <div style="min-width: 250px;">
             <ng-template #dropdownTemplate let-item let-highlight="highlight">
                <strong>{{ item.displayValue }}</strong
               >({{ highlight }})
             </ng-template>
             <label for="uniqueId">{{control.config.label}}</label><br />
             <pre>(maxHeight: 600px)</pre>
             <dropdown-select
               [toStringFunction]="objectToStringFunction"
               [multiSelectEnabled]="true"
               [selectAllEnabled]="true"
               [searchEnabled]="false" 
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
  styles: ``
})
export class DynamicDropdownComponent extends BaseDynamicControlComponent   {
  
  public readonly objectToStringFunction = (item: any) => item.name;

  public objectSearchMatchFunction = (searchValue: string, item: SelectOption) => {
    return `${item.value.name}`.toLowerCase().includes(searchValue.toLowerCase());
  }; 

}
