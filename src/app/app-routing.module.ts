import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardSearchComponent } from './card-search.component'
import { CardSearchResultsComponent } from './card-search-results.component';

const routes: Routes = [
	{path: '', redirectTo: '/search', pathMatch: 'full', },
	{path: 'search', 				component: CardSearchComponent,},
	{path: 'similar/:name/:page', 	component: CardSearchResultsComponent},
];



@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			{ enableTracing: true }, // <-- debugging purposes only
		)
	],
	exports: [RouterModule],

})

export class AppRoutingModule{}