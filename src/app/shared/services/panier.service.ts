import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient } from '../interfaces/ingredient.interface';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  public ingredient$: BehaviorSubject<Ingredient[] | null> =
    new BehaviorSubject<Ingredient[] | null>(null);

  constructor() {}

  public addToPanier(ingredients: Ingredient[]): void {
    const currentValue = this.ingredient$.value;

    if (currentValue) {
      const obj = [...currentValue, ...ingredients].reduce(
        (acc: { [key: string]: number }, value: Ingredient) => {
          if (acc[value.name]) {
            acc[value.name] += value.quantity;
          } else {
            acc[value.name] = value.quantity;
          }
          return acc;
        },
        {}
      );
      const result = Object.keys(obj).map((key) => ({
        name: key,
        quantity: obj[key],
      }));
      this.ingredient$?.next(result);
    } else {
      this.ingredient$?.next(ingredients);
    }
  }
}
