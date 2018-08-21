import { Injectable, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable }     from 'rxjs';
// Observable class extensions
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Subject }           from 'rxjs/Subject';


import { Card }           from './card';

export class SearchResult{
	card: Card;
	results: Card[];
	constructor(_target_card : Card , _similar_cards : Card[]){
		this.card = _target_card;
		this.results = _similar_cards;
	}
}

@Injectable()
export class CardSearchService {
	allCardNames: string[] = [];
	filtered: Observable<string[]>;
	nameFilter: Subject<string> = new Subject<string>();
	filterSubscription;

	headers = new Headers({
		'Access-Control-Allow-Origin':'*',
		'Content-Type': 'application/json',
	});
	constructor(private http: Http ){
		this.getAllCardNames().then(
		names => 
			 {
				 this.allCardNames = names;
				console.log('done downloading all card names');
				console.log('some card names:' + this.allCardNames.slice(0,10));
				this.allCardNames = names;
				return names;


			 }).catch(this.handleError);

	}

	handleError(error: any):Promise<any>{
		console.error('An error occurred', error);
		return Promise.reject(error.message || error );

	}

	getAllCardNames():Promise<string[]> {
		//download list of card names to use for auto-suggest as user types

		console.log('download all card names');

		return this.http.get('https://card-codex-clone.herokuapp.com/static/card_commander_cardlist.txt').toPromise().then(response =>{

			 let names  = response.text().split('\n');
			 return names;

		});
		

	}

	filter(name: string): Observable<string[]>{
		this.nameFilter.next(name);
		let found: string[] = [];
			for (let item of this.allCardNames){
				if (item.toLowerCase().indexOf(name.toLowerCase()) === 0){
						found.push(item);
				}
				if (found.length >= 50){
					break;
				}

			}
		return Observable.of<string[]>(found);

	}
	searchSimilar(name: string, page: number = 1, colorIdentity: string=''): Observable<SearchResult>{

		let url: string = `https://card-codex-clone.herokuapp.com/api/?card=${name}&page=${page}&ci=${colorIdentity}`;

		if (colorIdentity.length > 0){
			url += ``;
		}

		console.log(name + ' ' + page + ' ' + colorIdentity + ' ' +url);

		return this.http.get(url,)
			.map(response => {
				return new SearchResult(
					response.json().target_card as Card,
					response.json().similar_cards as Card[],
				)
				
			})
	}
}
