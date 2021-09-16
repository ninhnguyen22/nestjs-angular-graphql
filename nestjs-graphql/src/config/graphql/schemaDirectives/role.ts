import { AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class RoleDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const {resolve = defaultFieldResolver} = field;

    const { role } = this.args;

    field.resolve = function(...args) {
      const context = args[2];
      let currentUser = context.currentUser;
      if (!currentUser) {
        currentUser = context.req.currentUser;
      }

      if (!currentUser) {
        throw new AuthenticationError('Authentication token is invalid.');
      }

      if (!currentUser.roles) {
        throw new AuthenticationError('Authentication token is invalid.');
      }

      const userRoles = currentUser.roles.map(r => r.code);

      if (!userRoles.includes(role)) {
        return new AuthenticationError('Authentication token is invalid.');
      }
      return resolve.apply(this, args);
    };
  }
}
