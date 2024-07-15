import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs'; 
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { DynamicFormConfig } from '../../dynamic-forms.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicControlResolverService } from '../../dynamic-control-resolver.service';
import { ControlInjectorPipe } from '../../control-injector.pipe';
 

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgForOf, NgIf, ControlInjectorPipe ],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrl: './dynamic-forms-page.component.scss'
})
export class DynamicFormsPageComponent implements OnChanges {
  @Input() formConfig!: DynamicFormConfig; 

  form!: FormGroup;

  constructor( 
    protected resolver: DynamicControlResolverService,
  ) { }  

  
  ngOnChanges() { 
    if (this.formConfig) {
      this.buildForm(this.formConfig.controls);
    }
  }
  buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});
    Object.keys(controls).forEach((key) => {
      const control = controls[key];
      const validators = this.resolveValidators(control as any); 
      const formControl = new FormControl(control.value, validators);
      this.form?.addControl(key, formControl);
    })
  }

  resolveValidators(validators: ValidatorConfig = {}) {
    return (Object.keys(validators) as Array<keyof ValidatorConfig>).map((validatorKey) => {
        const validatorValue = validators[validatorKey];
        if (validatorKey === 'required') {
          return Validators.required;
        }
        if (validatorKey === 'email') {
          return Validators.email;
        }
        if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
          return Validators.minLength(validatorValue);
        }
        return Validators.nullValidator
      }
    );
  }


  protected onSubmit() {
    console.log('Submitted data: ', this.form.value);
    this.form.reset();
  }

}

type ValidatorConfig = {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  // Add other validators as needed
};
