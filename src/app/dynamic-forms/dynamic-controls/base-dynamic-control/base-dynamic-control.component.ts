import { Directive, inject } from '@angular/core';
import { CONTROL_DATA } from '../../control.token';
import { ControlContainer, FormGroup } from '@angular/forms';

@Directive()
export class BaseDynamicControlComponent {

  readonly control = inject(CONTROL_DATA);
  readonly parentFormContainer = inject(ControlContainer);

  get formGroup() {
    return this.parentFormContainer.control as FormGroup;
  }
}
