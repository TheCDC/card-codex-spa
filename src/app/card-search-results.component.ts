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
		
	) {}

	ngOnInit():void{
		let sub = this.route.queryParams.subscribe((params: Params) => {
			this.isLoading = true;

			if (params['ci'] !== undefined) {
				this.colorIdentity = params['ci'];
				console.log("ci=",this.colorIdentity);
			}
			this.query();
		});
		this.subscriptions.push(sub);

		sub = this.route.params.subscribe((params: Params) => {
			this.isLoading = true;
			console.log(params);
				let name = '';
				if (params['name'] !== undefined) {
					this.name = params['name'];
					
				}
				if (params['page'] !== undefined) {
					this.page = +params['page'];
				}

				if (params['ci'] !== undefined) {
					this.colorIdentity = params['ci'];
					console.log("ci=",this.colorIdentity);
				}

				this.query();
			
		});
		this.subscriptions.push(sub);


      
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