import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { InterpolationSwitchComponent } from './precision-agriculture/interpolation/interpolation-switch/interpolation-switch.component';
import { RectificationComponent } from './precision-agriculture/rectification/rectification.component';
import { SingleLayerMappingComponent } from './layer-visualization/map/single-layer-mapping/single-layer-mapping.component';
import { TablePageComponent } from './layer-visualization/table/table-page/table-page.component';

const routes: Routes = [
  { path: '', component: CardsDisplayComponent },
  { path: 'interpolation/:layerIndex', component: InterpolationSwitchComponent },
  { path: 'rectification/:layerIndex', component: RectificationComponent },
  { path: 'single-layer-mapping/:layerIndex', component: SingleLayerMappingComponent },
  { path: 'table-visualization/:layerIndex', component: TablePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
