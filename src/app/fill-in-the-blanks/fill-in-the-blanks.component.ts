import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { widgetDisplayOptions } from '../config/config';
import { DynamicFormConfig } from '../dynamic-forms/dynamic-forms.model';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  } ;
 
  @Output() buildForm = new EventEmitter<DynamicFormConfig>();
  #http = inject(HttpClient);

  ngOnInit() {
    this.buildForm.emit(this.configDisplayOptions)
  }
  createFormComponent() {
    this.#http.get<DynamicFormConfig>(`assets/company.form.json`).pipe(
      tap((formConfig: DynamicFormConfig) => {
        this.buildForm.emit(formConfig)
      })
    ).subscribe();
  }
}
