import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';


import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';

import { CardSearchService } from './card-search.service';
import { CardSearchComponent } from './card-search.component';
import { CardDisplayComponent } from './card-display.component'
import { CardSearchResultsComponent } from './card-search-results.component';
import { CardsListComponent } from './cards-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CardSearchComponent,
    CardDisplayComponent,
    CardSearchResultsComponent,
    CardsListComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,

  ],
  providers: [

    CardSearchService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
