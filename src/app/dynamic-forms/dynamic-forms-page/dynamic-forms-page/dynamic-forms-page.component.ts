import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs'; 
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { DynamicFormConfig } from '../../dynamic-forms.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicControlResolverService } from '../../dynamic-control-resolver.service';
import { ControlInjectorPipe } from '../../control-injector.pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgForOf, NgIf, ControlInjectorPipe ],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrl: './dynamic-forms-page.component.scss'
})
export class DynamicFormsPageComponent implements OnInit {
 
  protected formConfig$!: Observable<DynamicFormConfig>

  form!: FormGroup;

  constructor(
    private http: HttpClient,
    protected resolver: DynamicControlResolverService,
  ) { }

  ngOnInit(): void {
    this.formConfig$ = this.http.get<DynamicFormConfig>(`assets/company.form.json`).pipe( 
      tap(({ controls }) => this.buildForm(controls))
    );
  }

  buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});
    Object.keys(controls).forEach((key) => {
      console.log(controls[key]);
      const control = controls[key];  
      const formControl = new FormControl(control.value);
      this.form?.addControl(key, formControl);
    })
  }

 

  protected onSubmit() {
    console.log('Submitted data: ', this.form.value);
    this.form.reset();
  }

}
