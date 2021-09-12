import { Injectable } from '@angular/core';
import { onError } from "apollo-link-error";
import { first } from "rxjs/operators";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from 'apollo-link-ws';

import { AuthenticationService } from "../../auth/auth.service";
import promiseToObservable from "./promiseToObservable";
import { RefreshTokenMutation } from "../../manager/user/models";
import { environment } from "../../../environments/environment";
import { SubscriptionClient } from "subscriptions-transport-ws";

const UNAUTHENTICATED_CODE = 'UNAUTHENTICATED';

@Injectable({providedIn: 'root'})
export class ApolloService {
  constructor(public authService: AuthenticationService) {
  }

  errLink() {
    return onError(({graphQLErrors, networkError, operation, forward}) => {
      console.log(graphQLErrors)
      if (graphQLErrors)
        for (let err of graphQLErrors) {
          const code = err?.message?.code;
          if (code && code === UNAUTHENTICATED_CODE && this.isExceptedOperator(operation.operationName)) {
            const oldHeaders = operation.getContext().headers;
            // Retry the request
            return promiseToObservable(this.getRefreshToken())
              .flatMap((res: any) => {
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
                }
              });
          }
        }

      if (networkError) console.log(networkError);
    })
  }

  authLink() {
    return new ApolloLink((operation, forward) => {
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
  }

  wsLink() {
    return new WebSocketLink({
      uri: `ws://localhost:3000/graphql`,
      options: {
        reconnect: true,
        connectionParams: {
          authToken: this.authService.getToken(),
        },
      },
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
