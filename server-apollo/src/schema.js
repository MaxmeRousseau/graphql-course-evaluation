// TODO 1.2 - Schéma GraphQL (20 points)
// 
// Ce qu'il faut faire :
// 1. Définir les types : User, Board, Column, Task, Comment
// 2. Définir les types de pagination : TaskConnection, TaskEdge, PageInfo
// 3. Définir les operations Query, Mutation, Subscription

export const typeDefs = /* GraphQL */ `
  # Types principaux
  type User {
    # TODO : id, name, email
  }

  type Board {
    # TODO : id, name, columns
  }

  type Column {
    # TODO : id, name, order, tasks (avec pagination)
  }

  type Task {
    # TODO : id, title, description, assignees, column, comments
  }

  type Comment {
    # TODO : id, content, author, task, createdAt
  }

  # Pagination
  type TaskEdge {
    # TODO : node, cursor
  }

  type PageInfo {
    # TODO : endCursor, hasNextPage
  }

  type TaskConnection {
    # TODO : edges, pageInfo
  }

  # Operations
  type Query {
    me: User
    board: Board!
    users: [User!]!
  }

  input CreateTaskInput {
    # TODO : title, description, assigneeIds, columnId
  }

  input UpdateTaskInput {
    # TODO : id, title, description, assigneeIds
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
