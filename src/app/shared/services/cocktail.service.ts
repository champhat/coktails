import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { Cocktail } from '../interfaces/cocktail.iterface';

@Injectable({
  providedIn: 'root',
})
export class CocktailService {
  public cocktails$: BehaviorSubject<Cocktail[] | []> = new BehaviorSubject<
    Cocktail[] | []
  >([]);
  public getCocktail(index: number): Observable<Cocktail> {
    return this.cocktails$.pipe(
      filter((cocktails: Cocktail[]) => cocktails != null),
      map((cocktails: Cocktail[]) => cocktails[index])
    );
  }
  public addCocktail(cocktail: Cocktail): Observable<Cocktail> {
    return this.http
      .post<Cocktail>('https://restapi.fr/api/cocktails', cocktail)
      .pipe(
        tap((saveCocktail: Cocktail) => {
          const value = this.cocktails$.value;
          this.cocktails$.next([...value, saveCocktail]);
        })
      );
  }

  public editCocktail(
    cocktailId: string,
    editedCocktail: Cocktail
  ): Observable<Cocktail> {
    return this.http
      .patch<Cocktail>(
        `https://restapi.fr/api/cocktails/${cocktailId}`,
        editedCocktail
      )
      .pipe(
        tap((saveCocktail: Cocktail) => {
          const value = this.cocktails$.value;
          this.cocktails$.next(
            //on itere sur toute la liste des cockails récupé avec map
            value!.map((cocktail: Cocktail) => {
              // si même nom on édit c à d on retourne le cocktail éditer pour eviter doublons
              if (cocktail.name === saveCocktail.name) {
                return saveCocktail;
              } else {
                // sinon on retourne le cocktail einitial
                return cocktail;
              }
            })
          );
        })
      );
  }

  // public editCocktail(editedCocktail: Cocktail): void {
  //   //on recupe la liste de tout nos cocktails
  //   const value = this.cocktails$.value;
  //   this.cocktails$.next(
  //     //on itere sur toute la liste des cockails récupé avec map
  //     value!.map((cocktail: Cocktail) => {
  //       // si même nom on édit c à d on retourne le cocktail éditer pour eviter doublons
  //       if (cocktail.name === editedCocktail.name) {
  //         return editedCocktail;
  //       } else {
  //         // sinon on retourne le cocktail einitial
  //         return cocktail;
  //       }
  //     })
  //   );
  // }

  constructor(private http: HttpClient) {
    //this.seed();
  }

  //tap est un opérateur qui fait rien
  public fecthCocktails(): Observable<Cocktail[]> {
    return this.http.get<Cocktail[]>('https://restapi.fr/api/cocktails').pipe(
      tap((cocktails: Cocktail[]) => {
        this.cocktails$.next(cocktails);
      })
    );
  }

  // On initialise avec des valeurs par défaut
  public seed() {
    this.http
      .post('https://restapi.fr/api/cocktails', {
        name: 'Mojito',
        img: 'https://www.hangoverweekends.co.uk/media/15505/mojito.jpg?width=500&height=375',
        description:
          'The Mojito complimenting summer perfectly with a fresh minty taste. The mixture of white rum, mint, lime juice, sugar and soda water is crisp and clean with a relatively low alcohol content, the soda water can be replaced with sprite or 7-up. When preparing a mojito always crush the mint leaves as opposed to dicing to unlock oils that will assist with enhancing the minty flavour.',
        ingredients: [
          {
            name: 'Menthe',
            quantity: 2,
          },
          {
            name: 'Perrier',
            quantity: 1,
          },
          {
            name: 'Rhum',
            quantity: 3,
          },
        ],
      })
      .subscribe();

    this.http
      .post('https://restapi.fr/api/cocktails', {
        name: 'Mojito',
        img: 'https://www.hangoverweekends.co.uk/media/15505/mojito.jpg?width=500&height=375',
        description:
          'The Mojito complimenting summer perfectly with a fresh minty taste. The mixture of white rum, mint, lime juice, sugar and soda water is crisp and clean with a relatively low alcohol content, the soda water can be replaced with sprite or 7-up. When preparing a mojito always crush the mint leaves as opposed to dicing to unlock oils that will assist with enhancing the minty flavour.',
        ingredients: [
          {
            name: 'Menthe',
            quantity: 2,
          },
          {
            name: 'Perrier',
            quantity: 1,
          },
          {
            name: 'Rhum',
            quantity: 3,
          },
        ],
      })
      .subscribe();

    this.http
      .post('https://restapi.fr/api/cocktails', {
        name: 'Mojito',
        img: 'https://www.hangoverweekends.co.uk/media/15505/mojito.jpg?width=500&height=375',
        description:
          'The Mojito complimenting summer perfectly with a fresh minty taste. The mixture of white rum, mint, lime juice, sugar and soda water is crisp and clean with a relatively low alcohol content, the soda water can be replaced with sprite or 7-up. When preparing a mojito always crush the mint leaves as opposed to dicing to unlock oils that will assist with enhancing the minty flavour.',
        ingredients: [
          {
            name: 'Menthe',
            quantity: 2,
          },
          {
            name: 'Perrier',
            quantity: 1,
          },
          {
            name: 'Rhum',
            quantity: 3,
          },
        ],
      })
      .subscribe();
  }
}
