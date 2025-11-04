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
      return user;
    },
    board: () => {
      const board = { ...seedData.board };
      board.columns = board.columns.slice().sort((a, b) => a.order - b.order);
      return board;
    },
    users: () => {
      return seedData.users.map(({ password, ...user }) => user);
    },
  },

  Board: {
    columns: (board) => {
      return board.columns.slice().sort((a, b) => a.order - b.order);
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
      let tasks = seedData.tasks.filter(task => task.columnId === column.id);

      if (after) {
        const afterId = fromCursor(after);
        const index = tasks.findIndex(task => task.id === afterId);
        if (index >= 0) {
          tasks = tasks.slice(index + 1);
        }
      }

      const slicedTasks = tasks.slice(0, first);
      const edges = slicedTasks.map(task => ({
        node: task,
        cursor: toCursor(task.id)
      }));

      const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
      const hasNextPage = tasks.length > first;

      return {
        edges,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    }
  },

  Task: {
    assignees: (task) => {
      return seedData.users.filter(user => task.assigneeIds.includes(user.id));
    },
    column: (task) => {
      return seedData.columns.find(column => column.id === task.columnId);
    },
    comments: (task) => {
      return seedData.comments.filter(comment => comment.taskId === task.id);
    }
  },

  Comment: {
    author: (comment) => {
      return seedData.users.find(user => user.id === comment.authorId);
    },
    task: (comment) => {
      return seedData.tasks.find(task => task.id === comment.taskId);
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
      if (!user) throw new Error('Authentication required');

      const newTask = {
        id: nanoid(),
        title: input.title,
        description: input.description || '',
        assigneeIds: input.assigneeIds,
        columnId: input.columnId
      };

      seedData.tasks.push(newTask);

      pubSub.publish(TOPICS.TASK_CREATED(seedData.board.id), { taskCreated: newTask });

      return newTask;
    },

    updateTask: (_, { input }, { user, pubSub }) => {
      if (!user) throw new Error('Authentication required');

      const task = seedData.tasks.find(t => t.id === input.id);
      if (!task) throw new Error('Task not found');

      task.title = input.title;
      task.description = input.description || '';
      task.assigneeIds = input.assigneeIds;

      pubSub.publish(TOPICS.TASK_UPDATED(seedData.board.id), { taskUpdated: task });

      return task;
    },

    moveTask: (_, { id, toColumnId }, { user, pubSub }) => {
      if (!user) throw new Error('Authentication required');

      const task = seedData.tasks.find(t => t.id === id);
      if (!task) throw new Error('Task not found');

      task.columnId = toColumnId;

      pubSub.publish(TOPICS.TASK_MOVED(seedData.board.id), { taskMoved: task });

      return task;
    },

    deleteTask: (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const taskIndex = seedData.tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) throw new Error('Task not found');

      seedData.tasks.splice(taskIndex, 1);

      return true;
    },

    // TODO 2.4 - Mutations de commentaires (inclus dans Mutation)
    // Ce qu'il faut faire :
    // - Créer le commentaire avec nanoid() et createdAt
    // - Publier l'événement COMMENT_ADDED
    // - Pour deleteComment, vérifier que l'utilisateur est l'auteur
    
    addComment: (_, { taskId, content }, { user, pubSub }) => {
      if (!user) throw new Error('Authentication required');

      const task = seedData.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const newComment = {
        id: nanoid(),
        content,
        authorId: user.id,
        taskId,
        createdAt: new Date().toISOString()
      };

      seedData.comments.push(newComment);

      pubSub.publish(TOPICS.COMMENT_ADDED(taskId), { commentAdded: newComment });

      return newComment;
    },

    deleteComment: (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const commentIndex = seedData.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) throw new Error('Comment not found');

      const comment = seedData.comments[commentIndex];
      if (comment.authorId !== user.id) throw new Error('Not authorized to delete this comment');

      seedData.comments.splice(commentIndex, 1);

      return true;
    }
  },

  // TODO 2.5 - Subscriptions (15 points)
  // Ce qu'il faut faire :
  // - subscribe : Utiliser pubSub.asyncIterator(TOPICS.XXX(id))
  // - resolve : Extraire les données du payload
  
  Subscription: {
    taskCreated: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TOPICS.TASK_CREATED(seedData.board.id));
      },
      resolve: (payload) => {
        return payload.taskCreated;
      }
    },
    taskUpdated: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TOPICS.TASK_UPDATED(seedData.board.id));
      },
      resolve: (payload) => {
        return payload.taskUpdated;
      }
    },
    taskMoved: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TOPICS.TASK_MOVED(seedData.board.id));
      },
      resolve: (payload) => {
        return payload.taskMoved;
      }
    },
    commentAdded: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator(TOPICS.COMMENT_ADDED(seedData.board.id));
      },
      resolve: (payload) => {
        return payload.commentAdded;
      }
    }
  }
});
