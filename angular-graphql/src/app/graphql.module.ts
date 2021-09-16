import { NgModule } from '@angular/core';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from '../environments/environment';

import { NotificationService } from './shared/services';
import { AuthenticationService } from './auth/auth.service';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import promiseToObservable from './shared/services/promiseToObservable';
import { RefreshTokenMutation } from './manager/user/models';
import { first } from 'rxjs/operators';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const UNAUTHENTICATED_CODE = 'UNAUTHENTICATED';

@NgModule({
  exports: [
    ApolloModule,
    HttpLinkModule,
  ],
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    public authService: AuthenticationService,
    public notificationService: NotificationService,
  ) {

    const http = httpLink.create({uri: `${environment.apiUrl}/graphql`});

    const subscriptionClient = new SubscriptionClient(
      `${environment.webSocketUrl}/graphql`,
      {
        reconnect: true,
        connectionParams: {
          authToken: this.authService.getToken(),
        },
      },
    );

    const wsLink = new WebSocketLink(subscriptionClient);

    const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          const code = err.extensions.code;
          if (code && code === UNAUTHENTICATED_CODE && this.isExceptedOperator(operation.operationName)) {
            const oldHeaders = operation.getContext().headers;
            // Retry the request
            return promiseToObservable(this.getRefreshToken())
              .flatMap(
                (res: any) => {
                  const data: RefreshTokenMutation = res.data;
                  if (data.refreshToken && data.refreshToken.token) {
                    const accessToken = res.data.refreshToken.token;
                    this.authService.setToken(accessToken);
                    operation.setContext({
                      headers: {
                        ...oldHeaders,
                        token: accessToken
                      },
                    });
                    return forward(operation)
                  } else {
                    this.authService.logout();
                    window.location.reload();
                  }
                }
              );
          } else {
            this.notificationService.openSnackBar(err.message);
          }
        }
      }

      if (networkError) {
        console.log('networkError', networkError);
      }
    });

    const authLink = new ApolloLink((operation, forward) => {
      if (this.isExceptedOperator(operation.operationName)) {
        operation.setContext(({headers}) => ({
          headers: {
            token: this.authService.getToken(),
            ...headers
          }
        }));
      }

      return forward(operation);
    });

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

  getRefreshToken(): Promise<any> {
    return this.authService
      .refreshToken()
      .pipe(first())
      .toPromise();
  }

  isExceptedOperator(operationName: string) {
    return !['loginMutation', 'refreshTokenMutation'].includes(operationName)
  }
}
