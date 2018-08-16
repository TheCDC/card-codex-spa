import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from '@angular/router';
import  { Location } from '@angular/common';
import { Card } from './card'
import { CardSearchService, SearchResult  } from './card-search.service';


@Component({
	selector:'card-search-results',
	templateUrl: './card-search-results.component.html',
	styleUrls:['./card-search-results.component.css',],

})

export class CardSearchResultsComponent implements OnInit, OnDestroy{
	@Input() card: Card;
	@Input() cards: Card[];
	page: number = 1;
	json = JSON;
	isLoading : boolean = false;
	subscription;
	constructor(
	    private cardSearchService: CardSearchService,

		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		
	) {}

	ngOnInit():void{
		this.subscription = this.route.params.subscribe(params => {
			this.isLoading = true;
			console.log(params);
				let name = '';
				if (params['name'] !== undefined) {
					name = params['name'];
					
				}
				if (params['page'] !== undefined) {
					this.page = +params['page'];
				}

				this.cardSearchService.searchSimilar(name,this.page)
				.toPromise()
				.then(obj =>{
						this.isLoading = false;
						this.cards = obj.results;
						this.card = obj.card;
				});
		});
      
	}
	ngOnDestroy(): void{
		this.subscription.unsubscribe();
	}

	nextPage():void{
		this.page += 1;
	}



	goBack(): void{
		this.router.navigate(['/search']);
	}
}