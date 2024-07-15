import { Component, OnInit } from '@angular/core';
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
        [type]="control.config.type">
    </ng-container>
  `,
  styles: ``
})
export class DynamicInputComponent extends BaseDynamicControlComponent implements OnInit {


  ngOnInit(): void {
  }


}
