# 📋 Évaluation GraphQL - Kanban Board

## 🎯 Objectif

Mettre en pratique les compétences acquises durant le cours GraphQL en créant une application Kanban complète avec :
- Configuration d'un serveur GraphQL avec Apollo Server
- Définition d'un schéma GraphQL complet
- Implémentation de resolvers (queries, mutations, subscriptions)
- Configuration d'un client Apollo avec React
- Exploitation des données GraphQL côté frontend

## 📚 Consignes

👉 Consultez le fichier **[CONSIGNES.md](./CONSIGNES.md)** pour les instructions détaillées de l'évaluation.

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ installé
- Un éditeur de code (VS Code recommandé)

### Installation

**Serveur GraphQL :**
```bash
cd server-apollo
npm install
```

**Client React :**
```bash
cd client
npm install
```

### Démarrage

**1. Démarrer le serveur :**
```bash
cd server-apollo
npm start
```
Le serveur démarre sur `http://localhost:4000/graphql`

**2. Démarrer le client :**
```bash
cd client
npm run dev
```
Le client démarre sur `http://localhost:5173`

## 📁 Structure du projet

```
├── server-apollo/          # Serveur GraphQL
│   └── src/
│       ├── index.js        # Configuration Apollo Server
│       ├── schema.js       # Schéma GraphQL (typeDefs)
│       └── resolvers.js    # Resolvers (queries, mutations, subscriptions)
│
├── client/                 # Application React
│   └── src/
│       ├── apollo.js       # Configuration Apollo Client
│       ├── pages/
│       │   └── Board.jsx   # Page principale du board
│       └── components/
│           ├── Column.jsx          # Colonne de tâches
│           ├── TaskCard.jsx        # Carte de tâche
│           ├── TaskModal.jsx       # Modal d'édition
│           └── CommentSection.jsx  # Section commentaires
│
└── CONSIGNES.md           # Consignes détaillées de l'évaluation
```

## 🧪 Comptes de test

Utilisez ces comptes pour vous connecter :
- alice@example.com / password
- bob@example.com / password
- carol@example.com / password

## ⏱️ Durée

**3 heures**

## 📊 Barème (100 points)

- **Partie 1 - Configuration du serveur (30 points)**
  - Configuration Apollo Server : 10 points
  - Schéma GraphQL complet : 20 points

- **Partie 2 - Resolvers (40 points)**
  - Queries : 10 points
  - Mutations : 15 points
  - Subscriptions : 15 points

- **Partie 3 - Client Apollo (30 points)**
  - Configuration Apollo Client : 10 points
  - Queries et Mutations : 10 points
  - Subscriptions temps réel : 10 points

## 🎁 Fonctionnalités bonus (déjà implémentées)

Si vous terminez en avance, vous pouvez explorer ces fonctionnalités déjà présentes :
- ✅ Assignation multiple d'utilisateurs
- ✅ Système de commentaires avec temps réel
- ✅ Mode sombre
- ✅ Drag & drop des tâches

## 📝 Technologies utilisées

**Backend :**
- Apollo Server 4
- graphql-ws (WebSocket pour subscriptions)
- jsonwebtoken (JWT)
- Express

**Frontend :**
- React 18
- Apollo Client 3.11
- Vite
- Zustand (state management)

## 💡 Conseils

1. Suivez l'ordre des parties dans CONSIGNES.md
2. Testez régulièrement avec Apollo Sandbox
3. Utilisez les TODO dans le code comme guide
4. N'hésitez pas à consulter la documentation Apollo
5. Pensez à gérer les erreurs

## 📖 Ressources utiles

- [Documentation Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Documentation Apollo Client](https://www.apollographql.com/docs/react/)
- [GraphQL Schema Documentation](https://graphql.org/learn/schema/)

---

Bon courage ! 🚀
