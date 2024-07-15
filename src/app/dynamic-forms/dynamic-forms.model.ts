import { Validators } from '@angular/forms';
import { SelectOption } from '../dropdown/dropdown-select.component';
 
export type ValidatorKeys = keyof Omit<typeof Validators, 'prototype' | 'compose' | 'composeAsync'>;

export interface DynamicControl<T = string> {
  controlType: string;
  type?: string;
  options?: SelectOption[];
  label: string;
  value: T | null;
  validators?: {
    [key in ValidatorKeys]?: unknown;
  }
}

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl
  }
}
