import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DynamicFormsPageComponent } from './dynamic-forms/dynamic-forms-page/dynamic-forms-page/dynamic-forms-page.component';
import { FillInTheBlanksComponent } from './fill-in-the-blanks/fill-in-the-blanks.component';
import { DynamicFormConfig } from './dynamic-forms/dynamic-forms.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FillInTheBlanksComponent, DynamicFormsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dynamic-forms';
  formConfig!: DynamicFormConfig;

  buildForm(formConfig: DynamicFormConfig) { 
    this.formConfig = {
      ...formConfig
    }
  }
}
