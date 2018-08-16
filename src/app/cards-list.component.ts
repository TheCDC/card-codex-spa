import { Component, Input, OnInit } from "@angular/core";
import { Card } from './card'
import { CardSearchService } from './card-search.service'



@Component({
	selector: 'cards-list',
	templateUrl:'./cards-list.component.html',

})

export class CardsListComponent{
	@Input() cards: Card[];
	constructor(){}

}