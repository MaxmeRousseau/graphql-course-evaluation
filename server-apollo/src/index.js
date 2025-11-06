// TODO 1.1 - Configuration Apollo Server (10 points)
// Configurer Apollo Server v4 avec support des subscriptions WebSocket
// et authentification JWT

import { typeDefs } from './schema.js';
import { resolvers, seedData } from './resolvers.js';
import { PubSub } from 'graphql-subscriptions';

import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const pubSub = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers: resolvers({ pubSub }) });

const server = new ApolloServer({ schema,
 });

await server.start();


app.use('/graphql', 
    cors(),
    express.json(), 
    expressMiddleware(server, {
    context: async ({ req, res }) => {
        const auth = req.headers && (req.headers.authorization || req.headers.Authorization || '')
        let user = null
        if (auth && auth.startsWith('Bearer ')) {
            const token = auth.substring(7)
            try {
                const decoded = jwt.verify(token, SECRET)
                user = seedData.users.find(u => u.id === decoded.id)
                if (!user) { throw new Error('User not found') }
            } catch (e) {
                console.warn(`Unable to authenticate using auth token: ${token}`)
            }
        }
        return { user, SECRET, pubSub }
    }
}));



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
  useServer({ schema }, wsServer);
  console.log(`WebSocket server is running on ws://localhost:${PORT}/graphql`);
});

// TODO : Configurer Express, WebSocket, Apollo Server
// - Créer le schema avec makeExecutableSchema
// - Configurer le context avec authentification JWT
// - Démarrer le serveur sur le port 4000
