# Serveur GraphQL Python - Graphene

## Installation

```bash
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Démarrage

```bash
python app.py
```

Le serveur démarre sur `http://localhost:4000/graphql`

## Structure

- `app.py` : Configuration du serveur Flask et GraphQL
- `schema.py` : Définition du schéma GraphQL avec Graphene
- `resolvers.py` : Données et logique métier
- `auth.py` : Middleware d'authentification JWT
