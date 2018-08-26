import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
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
	card: Card;
	cards: Card[];
	name:string = '';
	page: number = 1;
	colorIdentity: string = '';
	json = JSON;
	isLoading : boolean = false;
	subscriptions = [];

	constructor(
	    private cardSearchService: CardSearchService,

		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		
	) {
			console.log('CardSearchResultsComponent instantiated');

			let sub = Observable.combineLatest(this.route.params, this.route.queryParams, (params, qparams) => ({ params, qparams }));

			sub.subscribe((allParams: Params) => {
				this.isLoading = true;

				if (allParams.qparams['ci'] !== undefined) {
					this.colorIdentity = allParams.qparams['ci'];
					console.log("ci=",this.colorIdentity);
				}

				let name = '';
				if (allParams.params['name'] !== undefined) {
					this.name = allParams.params['name'];
					
				}
				if (allParams.params['page'] !== undefined) {
					this.page = +allParams.params['page'];
				}


				this.query();


			});

		this.subscriptions.push(sub);


	}

	ngOnInit():void{


      
	}

	query():void{

		this.cardSearchService.searchSimilar(this.name, this.page, this.colorIdentity)
					.toPromise()
					.then(obj =>{
							this.cards = obj.results;
							this.card = obj.card;
							this.isLoading = false;
					});
	}
	ngOnDestroy(): void{
		for (let sub of this.subscriptions){
			sub.unsubscribe();
		}
	}

	previousPage():void{
		this.page -= 1;
		this.go();
	}

	go():void{
		this.router.navigate(['/similar',this.name,this.page,{'ci':this.colorIdentity}]);
	
	}


	nextPage():void{
		this.page += 1;
		this.go();
	}



	goBack(): void{
		this.router.navigate(['/search']);
	}
}