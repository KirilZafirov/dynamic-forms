import { Pipe, PipeTransform } from '@angular/core';
 

import { ITEM_LIMIT, SELECTED_ITEM_LIMIT } from '../helpers/item-limits';
import { SelectOption } from '../dropdown-select.component';

@Pipe({
  name: 'moreSelectedOptions',
  standalone: true,
})
export class MoreSelectedOptionsPipe implements PipeTransform {
  public transform(selectOptions: SelectOption[]): string[] {
    const leftOver = selectOptions.length - SELECTED_ITEM_LIMIT - ITEM_LIMIT;
    return [
      ...selectOptions
        .slice(SELECTED_ITEM_LIMIT, ITEM_LIMIT)
        .map((selectOption) => selectOption.displayValue),
      ...(leftOver > 0 ? [`+ ${leftOver} more items`] : []),
    ];
  }
}
