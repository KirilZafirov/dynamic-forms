import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicControlComponent } from '../base-dynamic-control/base-dynamic-control.component';

@Component({
  selector: 'app-dynamic-field',
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFieldComponent extends BaseDynamicControlComponent   {


  
}
