import 'hammerjs';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppMaterialModule } from './app.material.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { AppRoutingModule } from './app-routing.module';
import { ManagerModule } from './manager';
import { GraphQLModule } from './graphql.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppMaterialModule,
    BrowserAnimationsModule,

    GraphQLModule,
    AppRoutingModule,

    AuthModule,
    ManagerModule,
  ],
  declarations: [AppComponent],
  entryComponents: [],
  providers: [
    // {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
