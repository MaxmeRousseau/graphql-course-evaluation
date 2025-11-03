import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export const seedData = {
  users: [
    { id: 'u1', name: 'Alice', email: 'alice@example.com', password: 'password' },
    { id: 'u2', name: 'Bob', email: 'bob@example.com', password: 'password' },
    { id: 'u3', name: 'Carol', email: 'carol@example.com', password: 'password' },
  ],
  board: {
    id: 'b1',
    name: 'Board - Promo',
    columns: [
      { id: 'c1', name: 'Todo', order: 1 },
      { id: 'c2', name: 'Doing', order: 2 },
      { id: 'c3', name: 'Done', order: 3 },
    ]
  },
  tasks: [
    { id: 't1', title: 'Préparer slides', description: 'Séance 5', assigneeIds: ['u1', 'u2'], columnId: 'c1' },
    { id: 't2', title: 'Corriger TP', description: null, assigneeIds: ['u2'], columnId: 'c1' },
    { id: 't3', title: 'Démo subscription', description: 'Live coding', assigneeIds: ['u3'], columnId: 'c2' },
  ],
  comments: [
    { id: 'cm1', content: 'N\'oublie pas les animations!', authorId: 'u2', taskId: 't1', createdAt: new Date('2025-11-02T10:30:00').toISOString() },
    { id: 'cm2', content: 'Je peux t\'aider si besoin', authorId: 'u3', taskId: 't1', createdAt: new Date('2025-11-02T14:20:00').toISOString() },
  ]
};

function toCursor(id) { return Buffer.from(String(id), 'utf8').toString('base64'); }
function fromCursor(cursor) { return Buffer.from(String(cursor), 'base64').toString('utf8'); }

export const TOPICS = {
  TASK_CREATED: (boardId) => `TASK_CREATED_${boardId}`,
  TASK_UPDATED: (boardId) => `TASK_UPDATED_${boardId}`,
  TASK_MOVED:   (boardId) => `TASK_MOVED_${boardId}`,
  COMMENT_ADDED: (taskId) => `COMMENT_ADDED_${taskId}`
};

export const resolvers = ({ pubSub }) => ({
  // TODO 2.1 - Queries (10 points)
  // Ce qu'il faut faire :
  // - me : Retourner l'utilisateur connecté depuis le context
  // - board : Retourner le board avec ses colonnes triées par order
  // - users : Retourner tous les utilisateurs (sans le password)
  
  Query: {
    me: (_, __, { user }) => {
      // TODO
    },
    board: () => {
      // TODO
    },
    users: () => {
      // TODO
    },
  },

  Board: {
    columns: (board) => {
      // TODO
    }
  },

  // TODO 2.2 - Pagination (inclus dans Query)
  // Ce qu'il faut faire :
  // - Filtrer les tâches par columnId
  // - Gérer le paramètre 'after' pour paginer
  // - Créer les edges avec node + cursor
  // - Calculer pageInfo (endCursor, hasNextPage)
  
  Column: {
    tasks: (column, { first = 10, after }) => {
      // TODO : Utiliser toCursor() et fromCursor()
    }
  },

  Task: {
    assignees: (task) => {
      // TODO
    },
    column: (task) => {
      // TODO
    },
    comments: (task) => {
      // TODO
    }
  },

  Comment: {
    author: (comment) => {
      // TODO
    },
    task: (comment) => {
      // TODO
    }
  },

  // TODO 2.3 - Mutations de tâches (15 points)
  // Ce qu'il faut faire :
  // - Vérifier que l'utilisateur est authentifié
  // - Générer un ID unique avec nanoid()
  // - Publier les événements avec pubSub.publish()
  
  Mutation: {
    login: (_, { email, password }, { SECRET }) => {
      const user = seedData.users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid credentials');
      const { password: _pw, ...payload } = user;
      return jwt.sign(payload, SECRET, { expiresIn: '12h' });
    },

    createTask: (_, { input }, { user, pubSub }) => {
      // TODO
    },

    updateTask: (_, { input }, { user, pubSub }) => {
      // TODO
    },

    moveTask: (_, { id, toColumnId }, { user, pubSub }) => {
      // TODO
    },

    deleteTask: (_, { id }, { user }) => {
      // TODO
    },

    // TODO 2.4 - Mutations de commentaires (inclus dans Mutation)
    // Ce qu'il faut faire :
    // - Créer le commentaire avec nanoid() et createdAt
    // - Publier l'événement COMMENT_ADDED
    // - Pour deleteComment, vérifier que l'utilisateur est l'auteur
    
    addComment: (_, { taskId, content }, { user, pubSub }) => {
      // TODO
    },

    deleteComment: (_, { id }, { user }) => {
      // TODO
    }
  },

  // TODO 2.5 - Subscriptions (15 points)
  // Ce qu'il faut faire :
  // - subscribe : Utiliser pubSub.asyncIterator(TOPICS.XXX(id))
  // - resolve : Extraire les données du payload
  
  Subscription: {
    taskCreated: {
      // TODO
    },
    taskUpdated: {
      // TODO
    },
    taskMoved: {
      // TODO
    },
    commentAdded: {
      // TODO
    }
  }
});
