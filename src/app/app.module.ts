import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module';
import { NgModule } from '@angular/core';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { IDWComponent } from './precision-agriculture/interpolation/IDW/idw/idw.component';
import { IdwSelectorComponent } from './precision-agriculture/interpolation/IDW/idw-selector/idw-selector.component';
import { InterpolationSwitchComponent } from './precision-agriculture/interpolation/interpolation-switch/interpolation-switch.component';
import { KrigingComponent } from './precision-agriculture/interpolation/Kriging/kriging/kriging.component';
import { KrigingParametersTableComponent } from './precision-agriculture/interpolation/Kriging/kriging-parameters-table/kriging-parameters-table.component';
import { SelectorResultsComponent } from './precision-agriculture/interpolation/Kriging/selector-results/selector-results.component';
import { LayerCardComponent } from './main-menu/layer-card/layer-card.component';
import { MzTableComponent } from './layer-visualization/table/data-tables/mz-table/mz-table.component';
import { RectificationComponent } from './precision-agriculture/rectification/rectification.component';
import { SemivariogramResultsComponent } from './precision-agriculture/interpolation/Kriging/semivariogram-results/semivariogram-results.component';
import { SpLayerInfoComponent } from './layer-visualization/table/layer-info/sp-layer-info/sp-layer-info.component';
import { SpTableComponent } from './layer-visualization/table/data-tables/sp-table/sp-table.component';
import { TablePageComponent } from './layer-visualization/table/table-page/table-page.component';
import { TopBarComponent } from './main-menu/top-bar/top-bar.component';
import { ZmLayerInfoComponent } from './layer-visualization/table/layer-info/zm-layer-info/zm-layer-info.component';




@NgModule({
  declarations: [
    CardsDisplayComponent,
    ConfirmationDialogComponent,
    IDWComponent,
    IdwSelectorComponent,
    InterpolationSwitchComponent,
    KrigingComponent,
    KrigingParametersTableComponent,
    LayerCardComponent,
    MzTableComponent,
    RectificationComponent,
    SelectorResultsComponent,
    SemivariogramResultsComponent,
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
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [ TopBarComponent ]
})
export class AppModule { }
