import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownSelectComponent, SelectOption } from './dropdown/dropdown-select.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DynamicFormsPageComponent } from './dynamic-forms/dynamic-forms-page/dynamic-forms-page/dynamic-forms-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DynamicFormsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dynamic-forms';
 
}
