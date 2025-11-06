// TODO 3.1 - Configuration Apollo Client (10 points)
// Ce qu'il faut faire :
// 1. Créer HttpLink pour les queries/mutations (http://localhost:4000/graphql)
// 2. Créer AuthLink pour ajouter le token JWT dans les headers
// 3. Créer WebSocketLink pour les subscriptions (ws://localhost:4000/graphql)
// 4. Utiliser split() pour router selon le type d'opération
// 5. Créer ApolloClient avec le link et le cache InMemoryCache
// 6. Configurer typePolicies pour merger les edges de pagination

import useAuth from './store'
import { ApolloClient, InMemoryCache, split, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// TODO : Importer et configurer les links
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers}) => {
    const token = useAuth.getState().token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
})

const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => ({ authToken: useAuth.getState().token }),
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache({
  typePolicies: {
    Column: {
      fields: {
        tasks: {
          keyArgs: false,
          merge(existing = { edges: [] }, incoming) {
            if (!incoming) return existing;
            const incomingEdges = Array.isArray(incoming)
              ? incoming
              : (incoming.edges ?? []);
            const edges = existing.edges ? existing.edges.slice(0) : [];
            edges.push(...incomingEdges);
            return {
              edges,
              pageInfo: incoming.pageInfo ?? existing.pageInfo,
            };
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache
});
