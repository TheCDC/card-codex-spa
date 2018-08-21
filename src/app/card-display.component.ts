import { Component, Input, OnInit } from "@angular/core";
import { Card } from './card'
import { CardSearchService } from './card-search.service'
import { ActivatedRoute, Params, Router } from '@angular/router';



@Component({
	selector: 'card-display',
	templateUrl: './card-display.component.html',
	styleUrls: ['./card-display.component.css',],
})
export class CardDisplayComponent implements OnInit{
	@Input() card: Card;
	colorIdentity: Set<string> = new Set<string>([]);
	SYMBOLTOCOLOR = {
	  'W': "#FFF9D6",
	  'U': "#5EBEFF",
	  'B': "#000000",
	  'R': "#FF0000",
	  'G': "#1FAA00"
	};


	constructor(
		private cardSearchService: CardSearchService,
		private router: Router,
	) {}

	ngOnInit(): void{

	}

	searchThisCard():void{
		let link = ['/similar',this.card.name,1];
		this.router.navigate(link);
	}

}