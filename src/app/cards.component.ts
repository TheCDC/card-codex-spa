import { Component, OnInit } from '@angular/core';
import { Card } from './card';
import { CardSearchService } from './card-search.service';

@Component({
	selector: 'cards',
	templateUrl: './cards.component.html',
	styleUrls: ['./cards.component.css'],

})

export class CardsComponent implements OnInit {
	cards: Card[];

	constructor(private cardSearchService: CardSearchService) { }

	ngOnInit(): void {

	}

}