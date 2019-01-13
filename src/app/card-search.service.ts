import { Injectable, OnInit } from "@angular/core";
import { Headers, Http } from "@angular/http";

import { Observable } from "rxjs";
// Observable class extensions
import "rxjs/add/operator/map";
import "rxjs/add/observable/of";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import { Subject, BehaviorSubject, combineLatest } from "rxjs";
// import { combineLatest } from "rxjs/operators";

import { Card } from "./card";

export class SearchResult {
  card: Card;
  results: Card[];
  constructor(_target_card: Card, _similar_cards: Card[]) {
    this.card = _target_card;
    this.results = _similar_cards;
  }
}

@Injectable()
export class CardSearchService {
  allCardNames: BehaviorSubject<string[]> = new BehaviorSubject([]);
  filtered: BehaviorSubject<string[]> = new BehaviorSubject([]);
  nameFilter: BehaviorSubject<string> = new BehaviorSubject<string>("");
  loaded: boolean = false;
  searchedName$: Subject<string>;
  headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  });
  constructor(private http: Http) {
    this.getAllCardNames();
  }

  handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }

  getAllCardNames(): void {
    //download list of card names to use for auto-suggest as user types

    console.log("download all card names");

    this.http
      .get(
        "https://card-codex-clone.herokuapp.com/static/card_commander_cardlist.txt"
      )
      .map(response => {
        let names = response.text().split("\n");

        console.log("done downloading all card names");
        console.log("some card names:" + names.slice(0, 10));
        return names;
      })
      .subscribe(names => {
        this.allCardNames.next(names);
        this.loaded = true;
      });

    combineLatest(this.allCardNames, this.nameFilter).subscribe(
      ([names, searchedName]) => {
        let head: string[] = [];
        let tail: string[] = [];
        for (let item of names) {
          let idx = item.toLowerCase().indexOf(searchedName.toLowerCase());
          if (idx === 0) {
            head.push(item);
          } else if (idx !== -1) {
            tail.push(item);
          }
          if (head.length >= 10) {
            break;
          }
        }
        this.filtered.next(head.concat(tail.slice(0, 10)));
      }
    );
  }

  filter(name: string): void {
    this.nameFilter.next(name);
  }
  searchSimilar(
    name: string,
    page: number = 1,
    colorIdentity: string = ""
  ): Observable<SearchResult> {
    let url: string = `https://card-codex-clone.herokuapp.com/api/?card=${name}&page=${page}&ci=${colorIdentity}`;

    if (colorIdentity.length > 0) {
      url += ``;
    }

    // console.log("name=" + name + " page=" + page + " ci=" + colorIdentity + " " + url);

    return this.http.get(url).map(response => {
      return new SearchResult(
        response.json().target_card as Card,
        response.json().similar_cards as Card[]
      );
    });
  }
}
