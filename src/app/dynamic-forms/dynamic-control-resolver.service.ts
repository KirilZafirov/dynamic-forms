import { Injectable, Type } from '@angular/core';
import { DynamicControl } from './dynamic-forms.model';
import { DynamicInputComponent } from './dynamic-controls/dynamic-input/dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-controls/dynamic-select/dynamic-select.component';
import { DynamicDropdownComponent } from './dynamic-controls/dynamic-dropdown/dynamic-dropdown.component';

type DynamicControlMap = {
  [T in DynamicControl['controlType']]: Type<any>
}

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolverService {

  private controlComponents: DynamicControlMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
    dropdown: DynamicDropdownComponent
  };

  resolve(controlType: keyof DynamicControlMap) {
    return this.controlComponents[controlType];
  }

}
