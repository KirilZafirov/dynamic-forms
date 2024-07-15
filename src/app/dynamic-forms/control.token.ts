import { DynamicControl } from './dynamic-forms.model';
import { InjectionToken } from '@angular/core';

export interface ControlData {
  controlKey: string;
  config: DynamicControl;
}

export const CONTROL_DATA = new InjectionToken<ControlData>("Control Data");
