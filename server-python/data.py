from datetime import datetime

# Données en mémoire
seed_data = {
    "users": [
        {
            "id": "u1",
            "name": "Alice",
            "email": "alice@example.com",
            "password": "password",
        },
        {"id": "u2", "name": "Bob", "email": "bob@example.com", "password": "password"},
        {
            "id": "u3",
            "name": "Carol",
            "email": "carol@example.com",
            "password": "password",
        },
    ],
    "board": {
        "id": "b1",
        "name": "Board - Promo",
        "columns": [
            {"id": "c1", "name": "Todo", "order": 1},
            {"id": "c2", "name": "Doing", "order": 2},
            {"id": "c3", "name": "Done", "order": 3},
        ],
    },
    "tasks": [
        {
            "id": "t1",
            "title": "Préparer slides",
            "description": "Séance 5",
            "assigneeIds": ["u1", "u2"],
            "columnId": "c1",
        },
        {
            "id": "t2",
            "title": "Corriger TP",
            "description": None,
            "assigneeIds": ["u2"],
            "columnId": "c1",
        },
        {
            "id": "t3",
            "title": "Démo subscription",
            "description": "Live coding",
            "assigneeIds": ["u3"],
            "columnId": "c2",
        },
    ],
    "comments": [
        {
            "id": "cm1",
            "content": "N'oublie pas les animations!",
            "authorId": "u2",
            "taskId": "t1",
            "createdAt": "2025-11-02T10:30:00.000Z",
        },
        {
            "id": "cm2",
            "content": "Je peux t'aider si besoin",
            "authorId": "u3",
            "taskId": "t1",
            "createdAt": "2025-11-02T14:20:00.000Z",
        },
    ],
}

# Topics pour les subscriptions
TOPICS = {
    "TASK_CREATED": lambda board_id: f"TASK_CREATED_{board_id}",
    "TASK_UPDATED": lambda board_id: f"TASK_UPDATED_{board_id}",
    "TASK_MOVED": lambda board_id: f"TASK_MOVED_{board_id}",
    "COMMENT_ADDED": lambda task_id: f"COMMENT_ADDED_{task_id}",
}

# Helper functions pour la pagination
import base64


def to_cursor(id_value):
    """Encoder un ID en cursor base64"""
    return base64.b64encode(str(id_value).encode("utf-8")).decode("utf-8")


def from_cursor(cursor):
    """Décoder un cursor base64 en ID"""
    return base64.b64decode(cursor.encode("utf-8")).decode("utf-8")
