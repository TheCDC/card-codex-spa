import { Component, Input, OnInit } from "@angular/core";
import { Card } from './card'
import { CardSearchService } from './card-search.service'



@Component({
	selector: 'cards-list',
	templateUrl:'./cards-list.component.html',
	styleUrls:['./cards-list.component.css']

})

export class CardsListComponent{
	@Input() cards: Card[];
	constructor(){}

}