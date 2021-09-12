import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver, GraphQLField } from 'graphql';

export class AuthenticateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const {resolve = defaultFieldResolver} = field;

    field.resolve = function(...args) {
      const context = args[2];
      /* Get current user from context */
      let currentUser = context.currentUser;
      if (!currentUser) {
        currentUser = context.req.currentUser;
      }

      if (!currentUser) {
        throw new AuthenticationError('Authentication token is invalid.');
      }

      return resolve.apply(this, args);
    };
  }
}
