// TODO 1.1 - Configuration Apollo Server (10 points)
// Configurer Apollo Server v4 avec support des subscriptions WebSocket
// et authentification JWT

import { typeDefs } from './schema.js';
import { resolvers, seedData } from './resolvers.js';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// TODO : Configurer Express, WebSocket, Apollo Server
// - Créer le schema avec makeExecutableSchema
// - Configurer le context avec authentification JWT
// - Démarrer le serveur sur le port 4000
