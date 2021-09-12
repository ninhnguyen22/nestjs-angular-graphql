import 'hammerjs';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from '../environments/environment';

import { AppMaterialModule } from './app.material.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { AppRoutingModule } from './app-routing.module';
import { ManagerModule } from './manager';
import { ApolloService } from "./shared/services";
import { WebSocketLink } from "apollo-link-ws";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppMaterialModule,
    BrowserAnimationsModule,

    ApolloModule,
    HttpLinkModule,
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
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    apolloService: ApolloService
  ) {

    const http = httpLink.create({uri: `${environment.apiUrl}/graphql`});

    const wsLink = apolloService.wsLink();
    console.log(wsLink);
    const errorLink = apolloService.errLink();
    const authLink = apolloService.authLink();

    const httpLinkWithErrorHandling = ApolloLink.from([
      errorLink,
      authLink.concat(http),
    ]);

    // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
    const link = split(
      // split based on operation type
      ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLinkWithErrorHandling,
    );

    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache({
        addTypename: false
      })
    });
  }
}
