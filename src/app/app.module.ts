import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module';
import { NgModule } from '@angular/core';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { GradientCustomizationComponent } from './layer-visualization/map/map-legend-customization/gradient-customization/gradient-customization.component';
import { IDWComponent } from './precision-agriculture/interpolation/IDW/idw/idw.component';
import { IdwSelectorComponent } from './precision-agriculture/interpolation/IDW/idw-selector/idw-selector.component';
import { IndividualColorCustomizationComponent } from './layer-visualization/map/map-legend-customization/individual-color-customization/individual-color-customization.component';
import { InterpolationSwitchComponent } from './precision-agriculture/interpolation/interpolation-switch/interpolation-switch.component';
import { KrigingComponent } from './precision-agriculture/interpolation/Kriging/kriging/kriging.component';
import { KrigingParametersTableComponent } from './precision-agriculture/interpolation/Kriging/kriging-parameters-table/kriging-parameters-table.component';
import { SaveLayerEditingComponent } from './layer-visualization/save-layer-editing/save-layer-editing.component';
import { SaveServerResultsComponent } from './precision-agriculture/save-server-results/save-server-results.component';
import { SelectorResultsComponent } from './precision-agriculture/interpolation/Kriging/selector-results/selector-results.component';
import { SingleLayerMappingComponent } from './layer-visualization/map/single-layer-mapping/single-layer-mapping.component';
import { LayerCardComponent } from './main-menu/layer-card/layer-card.component';
import { MzTableComponent } from './layer-visualization/table/data-tables/mz-table/mz-table.component';
import { RectificationComponent } from './precision-agriculture/rectification/rectification.component';
import { SemivariogramResultsComponent } from './precision-agriculture/interpolation/Kriging/semivariogram-results/semivariogram-results.component';
import { SpLayerInfoComponent } from './layer-visualization/table/layer-info/sp-layer-info/sp-layer-info.component';
import { SpMappingInfoComponent } from './layer-visualization/map/layer-info/sp-mapping-info/sp-mapping-info.component';
import { SpTableComponent } from './layer-visualization/table/data-tables/sp-table/sp-table.component';
import { TablePageComponent } from './layer-visualization/table/table-page/table-page.component';
import { TopBarComponent } from './main-menu/top-bar/top-bar.component';
import { ZmLayerInfoComponent } from './layer-visualization/table/layer-info/zm-layer-info/zm-layer-info.component';
import { ZmMappingInfoComponent } from './layer-visualization/map/layer-info/zm-mapping-info/zm-mapping-info.component';

@NgModule({
  declarations: [
    CardsDisplayComponent,
    ConfirmationDialogComponent,
    GradientCustomizationComponent,
    IDWComponent,
    IdwSelectorComponent,
    IndividualColorCustomizationComponent,
    InterpolationSwitchComponent,
    KrigingComponent,
    KrigingParametersTableComponent,
    LayerCardComponent,
    MzTableComponent,
    RectificationComponent,
    SaveLayerEditingComponent,
    SaveServerResultsComponent,
    SelectorResultsComponent,
    SemivariogramResultsComponent,
    SingleLayerMappingComponent,
    SpLayerInfoComponent,
    SpMappingInfoComponent,
    SpTableComponent,
    TablePageComponent,
    TopBarComponent,
    ZmLayerInfoComponent,
    ZmMappingInfoComponent,
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
