import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs';
import { Subject }           from 'rxjs/Subject';
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { CardSearchService } from './card-search.service';
import { Card } from './card';



@Component({
  selector: 'card-search',
  templateUrl: './card-search.component.html',
  styleUrls: [ './card-search.component.css' ],
  providers: [CardSearchService]
})


export class CardSearchComponent implements OnInit {
  cards: Observable<Card[]>;
  filteredNames: Observable<string[]>;
  private searchTerms = new Subject<string>();
  private nameFilter = new Subject<string>();
  searchInProgress: boolean = false;
  previousTerm: string;
  colors:string[] = 'WUBRG'.split('');
  selectedColors: Set<string> = new Set<string>('WUBRG');
  selectedCard: string = '';

  constructor(
    private cardSearchService: CardSearchService,
    private router: Router,
    ) {


      this.filteredNames = this.nameFilter.debounceTime(10).switchMap(name => {
        this.searchInProgress = false;
        //return Observable.of<string[]>([]);
        
        let val = this.cardSearchService.filter(name);
        if (val === undefined){
          console.error('Val is undefined???');
        }
        return val;
      })
      
      .catch(error => {
        //console.error(error);
        this.searchInProgress = false;
        return Observable.of<string[]>([]);

      });

    }

    toggleColor(color: string):void{
      if (this.colors.indexOf(color) === -1){
        return;
      }
      if (this.selectedColors.has(color)){
        this.selectedColors.delete(color);

      }
      else{
        this.selectedColors.add(color);

      }
      console.log(this.selectedColors);
    }

    getSelectedColorsString():string{
      return Array.from(this.selectedColors).join('');
    }

  filter (name: string):void{
      this.selectedCard = '';
      this.searchInProgress = true;
  // Push a search term into the observable stream.

      this.nameFilter.next(name);
  }

  selectCard(name: string): void{
    this.selectedCard = name;
  }

  userSearchFor(name: string): void{
    this.router.navigate(['/similar', name, 1,{'ci':this.getSelectedColorsString()}]);
  }

  doSearch(): void{
    this.router.navigate(['/similar', this.selectedCard, 1,{'ci':this.getSelectedColorsString()}]);

  }
  
  ngOnInit(): void {


  }


  
}