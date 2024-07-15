import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { widgetDisplayOptions } from '../config/config';
import { DynamicFormConfig } from '../dynamic-forms/dynamic-forms.model';


@Component({
  selector: 'fill-in-the-blanks',
  standalone: true,
  imports: [],
  templateUrl: './fill-in-the-blanks.component.html',
  styleUrl: './fill-in-the-blanks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillInTheBlanksComponent {
  configDisplayOptions: DynamicFormConfig = {
    description: 'FIll In The Blanks',
    controls: widgetDisplayOptions.formData as any
  };

  @Output() buildForm = new EventEmitter<DynamicFormConfig>();


  ngOnInit() {
    this.buildForm.emit(this.configDisplayOptions)
  }
}
