// TODO 3.1 - Configuration Apollo Client (10 points)
// Ce qu'il faut faire :
// 1. Créer HttpLink pour les queries/mutations (http://localhost:4000/graphql)
// 2. Créer AuthLink pour ajouter le token JWT dans les headers
// 3. Créer WebSocketLink pour les subscriptions (ws://localhost:4000/graphql)
// 4. Utiliser split() pour router selon le type d'opération
// 5. Créer ApolloClient avec le link et le cache InMemoryCache
// 6. Configurer typePolicies pour merger les edges de pagination

import useAuth from './store'

// TODO : Importer et configurer les links

export const client = null // À remplacer par l'instance ApolloClient
