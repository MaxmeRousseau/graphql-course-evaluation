# TODO 1.2 - Schéma GraphQL (20 points)
#
# Ce qu'il faut faire :
# 1. Définir les types : User, Board, Column, Task, Comment
# 2. Définir les types de pagination : TaskConnection, TaskEdge, PageInfo
# 3. Définir les operations Query, Mutation, Subscription

import graphene
from graphene import relay
import jwt
from data import seed_data, TOPICS, to_cursor, from_cursor
from datetime import datetime

SECRET = "dev-secret-change-me"

# TODO : Définir les types GraphQL


# Types principaux
class User(graphene.ObjectType):
    # TODO : id, name, email
    pass


class Board(graphene.ObjectType):
    # TODO : id, name, columns
    pass


class Column(graphene.ObjectType):
    # TODO : id, name, order, tasks (avec pagination)
    pass


class Task(graphene.ObjectType):
    # TODO : id, title, description, assignees, column, comments
    pass


class Comment(graphene.ObjectType):
    # TODO : id, content, author, task, created_at
    pass


# Pagination
class TaskEdge(graphene.ObjectType):
    # TODO : node, cursor
    pass


class PageInfo(graphene.ObjectType):
    # TODO : end_cursor, has_next_page
    pass


class TaskConnection(graphene.ObjectType):
    # TODO : edges, page_info
    pass


# Input types
class CreateTaskInput(graphene.InputObjectType):
    # TODO : title, description, assignee_ids, column_id
    pass


class UpdateTaskInput(graphene.InputObjectType):
    # TODO : id, title, description, assignee_ids
    pass


# TODO 2.1 - Queries (10 points)
# Ce qu'il faut faire :
# - me : Retourner l'utilisateur connecté depuis le context
# - board : Retourner le board avec ses colonnes triées par order
# - users : Retourner tous les utilisateurs (sans le password)


class Query(graphene.ObjectType):
    me = graphene.Field(User)
    board = graphene.Field(Board)
    users = graphene.List(User)

    def resolve_me(self, info):
        # TODO
        pass

    def resolve_board(self, info):
        # TODO
        pass

    def resolve_users(self, info):
        # TODO
        pass


# TODO 2.3 - Mutations de tâches (15 points)
# Ce qu'il faut faire :
# - Vérifier que l'utilisateur est authentifié
# - Générer un ID unique
# - Publier les événements pour les subscriptions


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()

    def mutate(self, info, email, password):
        user = next(
            (
                u
                for u in seed_data["users"]
                if u["email"] == email and u["password"] == password
            ),
            None,
        )
        if not user:
            raise Exception("Invalid credentials")

        payload = {k: v for k, v in user.items() if k != "password"}
        token = jwt.encode(payload, SECRET, algorithm="HS256")
        return Login(token=token)


class CreateTask(graphene.Mutation):
    class Arguments:
        input = CreateTaskInput(required=True)

    task = graphene.Field(Task)

    def mutate(self, info, input):
        # TODO
        pass


class UpdateTask(graphene.Mutation):
    class Arguments:
        input = UpdateTaskInput(required=True)

    task = graphene.Field(Task)

    def mutate(self, info, input):
        # TODO
        pass


class MoveTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        to_column_id = graphene.ID(required=True)

    task = graphene.Field(Task)

    def mutate(self, info, id, to_column_id):
        # TODO
        pass


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        # TODO
        pass


# TODO 2.4 - Mutations de commentaires (inclus dans Mutation)
# Ce qu'il faut faire :
# - Créer le commentaire avec ID unique et createdAt
# - Publier l'événement COMMENT_ADDED
# - Pour deleteComment, vérifier que l'utilisateur est l'auteur


class AddComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)

    comment = graphene.Field(Comment)

    def mutate(self, info, task_id, content):
        # TODO
        pass


class DeleteComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        # TODO
        pass


class Mutation(graphene.ObjectType):
    login = Login.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    move_task = MoveTask.Field()
    delete_task = DeleteTask.Field()
    add_comment = AddComment.Field()
    delete_comment = DeleteComment.Field()


# TODO 2.5 - Subscriptions (15 points)
# Ce qu'il faut faire :
# - Écouter les événements publiés par les mutations
# - Retourner les données mises à jour


class Subscription(graphene.ObjectType):
    task_created = graphene.Field(Task, board_id=graphene.ID(required=True))
    task_updated = graphene.Field(Task, board_id=graphene.ID(required=True))
    task_moved = graphene.Field(Task, board_id=graphene.ID(required=True))
    comment_added = graphene.Field(Comment, task_id=graphene.ID(required=True))

    def resolve_task_created(self, info, board_id):
        # TODO
        pass

    def resolve_task_updated(self, info, board_id):
        # TODO
        pass

    def resolve_task_moved(self, info, board_id):
        # TODO
        pass

    def resolve_comment_added(self, info, task_id):
        # TODO
        pass


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
