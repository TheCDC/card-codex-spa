import { Component, Input, OnInit } from "@angular/core";
import { Card } from './card'
import { CardSearchService } from './card-search.service'
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
	selector: 'card-display',
	templateUrl: './card-display.component.html',
	styleUrls: ['./card-display.component.css',],
})
export class CardDisplayComponent{
	@Input() card: Card;

	constructor( private cardSearchService: CardSearchService,
	private router: Router,
	) {}

	searchThisCard():void{
		let link = ['/similar',this.card.name,1];
		this.router.navigate(link);
	}

}