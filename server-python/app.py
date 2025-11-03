# TODO 1.1 - Configuration serveur GraphQL (10 points)
# Configurer Flask avec Graphene et support des subscriptions WebSocket
# et authentification JWT

from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from schema import schema
from auth import AuthMiddleware

app = Flask(__name__)
CORS(app)

SECRET = "dev-secret-change-me"

# TODO : Configurer Flask, GraphQL endpoint, WebSocket
# - Créer l'endpoint /graphql avec GraphQLView
# - Configurer le context avec authentification JWT
# - Ajouter le support des subscriptions
# - Démarrer le serveur sur le port 4000

if __name__ == "__main__":
    # TODO
    pass
