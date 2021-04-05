import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { RectificationComponent } from './precision-agriculture/rectification/rectification.component';
import { TablePageComponent } from './layer-visualization/table/table-page/table-page.component';

const routes: Routes = [
  { path: '', component: CardsDisplayComponent },
  { path: 'table-visualization/:layerIndex', component: TablePageComponent },
  { path: 'rectification/:layerIndex', component: RectificationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
