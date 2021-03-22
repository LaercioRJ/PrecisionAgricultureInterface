import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';

import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';
import { LayerCardComponent } from './main-menu/layer-card/layer-card.component';
import { TopBarComponent } from './main-menu/top-bar/top-bar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    TopBarComponent,
    CardsDisplayComponent,
    LayerCardComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [ TopBarComponent ]
})
export class AppModule { }
