import { Pipe, PipeTransform } from '@angular/core';
import { Cocktail } from '../interfaces/cocktail.iterface';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: Cocktail[], search: string): Cocktail[] | null {
    return value.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}
