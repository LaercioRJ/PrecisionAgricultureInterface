import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material-module';
import { NgModule } from '@angular/core';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { LayerCardComponent } from './main-menu/layer-card/layer-card.component';
import { MzTableComponent } from './layer-visualization/table/data-tables/mz-table/mz-table.component';
import { RectificationComponent } from './precision-agriculture/rectification/rectification.component';
import { SpLayerInfoComponent } from './layer-visualization/table/layer-info/sp-layer-info/sp-layer-info.component';
import { SpTableComponent } from './layer-visualization/table/data-tables/sp-table/sp-table.component';
import { TablePageComponent } from './layer-visualization/table/table-page/table-page.component';
import { TopBarComponent } from './main-menu/top-bar/top-bar.component';
import { ZmLayerInfoComponent } from './layer-visualization/table/layer-info/zm-layer-info/zm-layer-info.component';



@NgModule({
  declarations: [
    CardsDisplayComponent,
    ConfirmationDialogComponent,
    LayerCardComponent,
    MzTableComponent,
    RectificationComponent,
    SpLayerInfoComponent,
    SpTableComponent,
    TablePageComponent,
    TopBarComponent,
    ZmLayerInfoComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [ TopBarComponent ]
})
export class AppModule { }
