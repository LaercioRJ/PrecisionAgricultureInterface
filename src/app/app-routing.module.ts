import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';

const routes: Routes = [
  { path: '', component: CardsDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
