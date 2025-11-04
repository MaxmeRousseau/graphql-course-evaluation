// TODO 1.1 - Configuration Apollo Server (10 points)
// Configurer Apollo Server v4 avec support des subscriptions WebSocket
// et authentification JWT

import { typeDefs } from './schema.js';
import { resolvers, seedData } from './resolvers.js';

import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

await server.start();


app.use('/graphql', express.json(), expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token })
}));



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

// TODO : Configurer Express, WebSocket, Apollo Server
// - Créer le schema avec makeExecutableSchema
// - Configurer le context avec authentification JWT
// - Démarrer le serveur sur le port 4000
