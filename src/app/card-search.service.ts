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
export class CardSearchService implements OnInit{
	allCardNames: string[] = [];
	filtered: Observable<string[]>;
	nameFilter: Subject<string> = new Subject<string>();
	filterSubscription;

	headers = new Headers({
		'Access-Control-Allow-Origin':'*',
		'Content-Type': 'application/json',
	});
	constructor(private http: Http ){}

	handleError(error: any):Promise<any>{
		console.error('An error occurred', error);
		return Promise.reject(error.message || error );

	}

	getAllCardNames():void {
		//download list of card names to use for auto-suggest as user types



		this.http.get('http://card-codex-clone.herokuapp.com/static/card_commander_cardlist.txt').toPromise().then(
		response => 
			 {
				 let names  = response.text().split('\n');
				 this.allCardNames = names;
			 }
		).catch(this.handleError);
	}
	ngOnInit(): void{
		this.getAllCardNames();

		this.filtered = this.nameFilter
		.distinctUntilChanged()
		.switchMap(name => {
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

		})
		.catch(error => {
		  // TODO: add real error handling
		  console.log(error);
		  return Observable.of<string[]>([]);
		});

	}

	filter(name: string): Observable<string[]>{
		this.nameFilter.next(name);
		return this.filtered;
		/*
		this.filtered = [];
		this.filterSubscription = this.getAllCardNames().subscribe(names =>{
			for (let item of names){
			if (item.toLowerCase().indexOf(name.toLowerCase()) === 0){
					this.filtered.push(item);

				}
				if (this.filtered.length >= 10){
					break;
				}

			}
			
			return this.filtered;
		})
		//this.filterSubscription.unsubscribe();
		return Observable.of<string[]>(this.filtered);
			*/



	}
	searchSimilar(name: string, page: number = 1): Observable<SearchResult>{
		let url: string = `https://card-codex-clone.herokuapp.com/api/?card=${name}&page=${page}`;

		return this.http.get(url,)
			.map(response => {
				return new SearchResult(
					response.json().target_card as Card,
					response.json().similar_cards as Card[],
				)
				
			})
	}
}
