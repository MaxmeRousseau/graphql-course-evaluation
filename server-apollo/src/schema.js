// TODO 1.2 - Schéma GraphQL (20 points)
// 
// Ce qu'il faut faire :
// 1. Définir les types : User, Board, Column, Task, Comment
// 2. Définir les types de pagination : TaskConnection, TaskEdge, PageInfo
// 3. Définir les operations Query, Mutation, Subscription

export const typeDefs = /* GraphQL */ `
  # Types principaux
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Board {
    id: ID!
    name: String!
    columns: [Column!]!
  }

  type Column {
    id: ID!
    name: String!
    order: Int!
    tasks(first: Int, after: String): [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    assignees: [User!]!
    column: Column!
    comments: [Comment!]!
    tasksConnection: TaskConnection!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    task: Task!
    createdAt: String!
  }

  # Pagination
  type TaskEdge {
    node: Task!
    cursor: String!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

  type TaskConnection {
    edges: [TaskEdge!]!
    pageInfo: PageInfo!
  }

  # Operations
  type Query {
    me: User
    board: Board!
    users: [User!]!
  }

  input CreateTaskInput {
    title: String!
    description: String
    assigneeIds: [ID!]!
    columnId: ID!
  }

  input UpdateTaskInput {
    id: ID!
    title: String!
    description: String
    assigneeIds: [ID!]!
  }

  type Mutation {
    login(email: String!, password: String!): String!
    createTask(input: CreateTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
    moveTask(id: ID!, toColumnId: ID!): Task!
    deleteTask(id: ID!): Boolean!
    addComment(taskId: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
  }

  type Subscription {
    taskCreated(boardId: ID!): Task!
    taskUpdated(boardId: ID!): Task!
    taskMoved(boardId: ID!): Task!
    commentAdded(taskId: ID!): Comment!
  }
`;
