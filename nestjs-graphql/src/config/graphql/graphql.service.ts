import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { UserService } from '../../modules/user/services';
import { join } from 'path';
import schemaDirectives from './schemaDirectives';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {

  constructor(private readonly userService: UserService) {
  }

  async createGqlOptions(): Promise<GqlModuleOptions> {
    return {
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      schemaDirectives,
      context: async ({req, res, connection}) => {
        if (connection) {
          return {
            req: connection.context,
          };
        }

        let currentUser: any;

        const {token} = req.headers;

        const excludeOperations = ['loginQuery', 'refreshTokenQuery'];

        if (req.body && !excludeOperations.includes(req.body.operationName) && token) {
          currentUser = await this.userService.findByToken(token);
        }

        return {
          req,
          res,
          currentUser,
        };
      },
      formatError: err => {
        return new HttpException(
          {message: err.message, code: err.extensions.code},
          HttpStatus[`${err.extensions.code}`] || HttpStatus.FORBIDDEN,
        );
      },
      formatResponse: res => {
        return res;
      },
      installSubscriptionHandlers: true,
      subscriptions: {
        onConnect: async (connectionParams: any) => {
          const authToken = connectionParams.authToken;
          // extract user information from token
          const currentUser = await this.userService.findByToken(authToken);
          // return user info to add them to the context later
          return {currentUser};
        },
      },
      debug: false,
      persistedQueries: {
        cache: new MemcachedCache(
          ['memcached-server-1', 'memcached-server-2', 'memcached-server-3'],
          {retries: 10, retry: 10000},
        ),
      },
      introspection: true,
      playground: process.env.NODE_ENV === 'prod' ? false : {
        settings: {
          'editor.cursorShape': 'block', // possible values: 'line', 'block', 'underline'
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.fontSize': 14,
          'editor.reuseHeaders': true, // new tab reuses headers from last tab
          'editor.theme': 'dark', // possible values: 'dark', 'light'
          'general.betaUpdates': false,
          'queryPlan.hideQueryPlanResponse': false,
          'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
          'tracing.hideTracingResponse': true,
        },
      },
    };
  }
}
