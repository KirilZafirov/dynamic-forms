import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common'; 
import { BaseDynamicControlComponent } from '../base-dynamic-control/base-dynamic-control.component';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  template: `
    <ng-container
        [formGroup]="formGroup"
    >
      <select [id]="control.controlKey" [value]="control.config.value">
        <option *ngFor="let option of control.config.options" [value]="option.value">{{option.name}}</option>
      </select>
    </ng-container>

  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSelectComponent extends BaseDynamicControlComponent {

}
