import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cocktail } from 'src/app/shared/interfaces/cocktail.iterface';
import { CocktailService } from 'src/app/shared/services/cocktail.service';
import { PanierService } from 'src/app/shared/services/panier.service';

@Component({
  selector: 'app-cocktail-details',
  templateUrl: './cocktail-details.component.html',
  styleUrls: ['./cocktail-details.component.scss'],
})
export class CocktailDetailsComponent implements OnInit, OnDestroy {
  public selectCocktail!: Cocktail | null;
  public subscription!: Subscription;

  constructor(
    private panierService: PanierService,
    private activatedRoute: ActivatedRoute,
    private cocktailService: CocktailService
  ) {
    this.cocktailService
      .getCocktail(+this.activatedRoute.snapshot.paramMap.get('index')!)
      .subscribe((cocktail: Cocktail) => {
        this.selectCocktail = cocktail;
      });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.cocktailService
        .getCocktail(+paramMap.get('index')!)
        .subscribe((cocktail: Cocktail) => {
          this.selectCocktail = cocktail;
        });
    });
  }

  public addToPanier() {
    this.panierService.addToPanier(this.selectCocktail!.ingredients);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
