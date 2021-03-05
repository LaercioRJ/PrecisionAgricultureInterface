import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';

import { TopBarComponent } from './main-menu/top-bar/top-bar.component';
import { CardsDisplayComponent } from './main-menu/cards-display/cards-display.component';

@NgModule({
  declarations: [
    TopBarComponent,
    CardsDisplayComponent
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
