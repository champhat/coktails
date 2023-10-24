import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Cocktail } from 'src/app/shared/interfaces/cocktail.iterface';
import { CocktailService } from 'src/app/shared/services/cocktail.service';

@Component({
  selector: 'app-cocktail-form',
  templateUrl: './cocktail-form.component.html',
  styleUrls: ['./cocktail-form.component.scss'],
})
export class CocktailFormComponent implements OnInit {
  public cocktailForm!: FormGroup;
  public cocktail!: Cocktail | null;
  get ingredients() {
    return this.cocktailForm.get('ingredients') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cocktailService: CocktailService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const index = paramMap.get('index')!;
      if (index !== null) {
        this.cocktailService
          .getCocktail(+index)
          .pipe(first())
          .subscribe((cocktail: Cocktail) => {
            this.cocktail = cocktail;
            this.initForm(this.cocktail!);
          });
      } else {
        this.initForm();
      }
    });
  }

  //dans le cas d'un cocktail nul on doit définir une valeur par défaut du parametre cocktail
  // ce qui chargera un formulaire vide (ça evite de faire plein de if)
  private initForm(
    cocktail: Cocktail = { name: '', description: '', img: '', ingredients: [] }
  ): void {
    this.cocktailForm = this.fb.group({
      name: [cocktail.name, Validators.required],
      img: [cocktail.img, Validators.required],
      description: [cocktail.description, Validators.required],
      //on doit transformer l'array d'ingredient en forme groupe avec map
      ingredients: this.fb.array(
        cocktail.ingredients.map((ingredient) =>
          this.fb.group({
            name: [ingredient.name, Validators.required],
            quantity: [ingredient.quantity, Validators.required],
          })
        ),
        Validators.required
      ),
    });
  }

  // push un form group dans le formArray
  public addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [0, Validators.required],
      })
    );
  }

  public submit(): void {
    if (this.cocktail) {
      // si le cocktail existe on l'édite ça evite d'avoir des cocktail en doublons
      this.cocktailService
        .editCocktail(this.cocktail._id!, this.cocktailForm.value)
        .subscribe();
    } else {
      this.cocktailService.addCocktail(this.cocktailForm.value).subscribe();
    }
    //on retourne un cran en arrière, la navigation doit  être relative
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
