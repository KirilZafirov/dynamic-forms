import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { widgetDisplayOptions } from '../config/config';
import { DynamicFormConfig } from '../dynamic-forms/dynamic-forms.model';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'fill-in-the-blanks',
  standalone: true,
  imports: [],
  templateUrl: './fill-in-the-blanks.component.html',
  styleUrl: './fill-in-the-blanks.component.scss'
})
export class FillInTheBlanksComponent {
  configDisplayOptions = widgetDisplayOptions;
  @Output() buildForm = new EventEmitter<DynamicFormConfig>();
  #http = inject(HttpClient);

  createFormComponent() {
    this.#http.get<DynamicFormConfig>(`assets/company.form.json`).pipe(
      tap((formConfig: DynamicFormConfig) => {
        this.buildForm.emit(formConfig)
      })
    ).subscribe();
  }
}
