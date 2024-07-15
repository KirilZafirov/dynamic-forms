import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { DynamicControl } from './dynamic-forms.model';
import { CONTROL_DATA } from './control.token';

@Pipe({
  name: 'controlInjector',
  standalone: true
})
export class ControlInjectorPipe implements PipeTransform {

  readonly parentInjector = inject(Injector);

  transform(controlKey: string, config: DynamicControl): Injector {
    return Injector.create([
      {
        provide: CONTROL_DATA,
        useValue: { controlKey, config },
      }
    ], this.parentInjector);
  }

}
