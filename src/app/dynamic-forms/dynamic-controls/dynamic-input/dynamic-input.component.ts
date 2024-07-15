import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControlComponent } from '../base-dynamic-control/base-dynamic-control.component';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  template: `
    <ng-container [formGroup]="formGroup">
      <input
        [formControlName]="control.controlKey"
        [value]="control.config.value"
        [id]="control.controlKey"
        [type]="control.config.type"
        [placeholder]="control.config.placeholder || control.config.label">
    </ng-container>
  `,
  styles: `
  input {
  border: none;
  background-color: #F4F5F9;
  border-radius: 9px;
  margin: 4px;
  padding: 0 12px;
}

input.ng-dirty {
  color: #5F60DA;
}

input[disabled] {
  color: #E0E2EC;
  background-color: #0e1e32;
}

textarea:focus, input:focus{
  outline: none;
}

*:focus {
  outline: none;
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicInputComponent extends BaseDynamicControlComponent   {



}
