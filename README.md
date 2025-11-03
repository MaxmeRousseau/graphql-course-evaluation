# 🎯 Projet Final – Kanban Collaboratif en Temps Réel
## Contexte

Vous allez concevoir une application collaborative de gestion de tâches inspirée d’un tableau Kanban (colonnes Todo, Doing, Done).
Chaque étudiant(e) devra démontrer sa maîtrise de GraphQL côté serveur et côté client, ainsi que sa capacité à construire une petite application fonctionnelle, sécurisée et en temps réel.

## Objectifs

Votre projet doit couvrir l’ensemble des notions vues dans le cours :

- ✅ Schéma GraphQL complet avec types, relations et pagination (cursor-based sur les tâches).
- ✅ Mutations pour créer, mettre à jour, déplacer et supprimer des tâches.
- ✅ Authentification par JWT (connexion avec un email/mot de passe).
- ✅ Subscriptions pour diffuser en temps réel les changements de tâches.
- ✅ Client React + Apollo Client consommant l’API (queries, mutations, subscriptions).

## Fonctionnalités attendues

- Création de compte ou connexion à un utilisateur existant (JWT).
- Affichage d’un tableau Kanban avec au moins 3 colonnes (Todo, Doing, Done).
- Ajout d’une tâche avec un titre, description (optionnelle), et assignation à un utilisateur.
- Déplacement d’une tâche d’une colonne à l’autre.
- Mise à jour en **temps réel** : si une tâche est créée ou déplacée par un utilisateur, les autres voient le changement immédiatement.
- Pagination des tâches (cursor-based) dans chaque colonne.

## Contraintes techniques

- Backend : Node.js + Apollo Server 4, données en mémoire (pas besoin de base de données).
- Frontend : React + Apollo Client, interface simple mais fonctionnelle.
- Authentification : JWT transmis dans les headers HTTP et dans les connectionParams WS.

## Critères d’évaluation (100 pts)

- Schéma GraphQL & Resolvers (25 pts) : types, relations, pagination.
- Mutations & Authentification (25 pts) : sécurité, logique métier.
- Subscriptions en temps réel (20 pts) : implémentation et cohérence.
- Client React (20 pts) : intégration Apollo, affichage clair, interactions.
- Qualité & organisation (10 pts) : code lisible, cohérent, bonne utilisation des concepts vus en cours.

---

👉 Le projet est réalisable en **3 heures**, avec un squelette fourni pour démarrer.

L’objectif n’est pas de faire une application parfaite, mais de montrer que vous savez appliquer **les concepts GraphQL dans un cas concret et complet**.
