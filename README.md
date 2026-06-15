# YTalk - Forum étudiant

YTalk est un forum étudiant que j’ai réalisé pour permettre aux élèves d’une école d’informatique d’échanger entre eux.

Le but du projet est simple : pouvoir poser une question, créer un topic, répondre à des messages, réagir avec des likes/dislikes et avoir une partie admin pour gérer le forum.

Le site est fait avec un thème sombre, avec du bleu et du orange pour garder une identité visuelle propre.

---

## Présentation du projet

YTalk permet à un utilisateur de :

* créer un compte ;
* se connecter ;
* voir les topics du forum ;
* rechercher un topic par titre, contenu, tag ou auteur ;
* créer un topic ;
* répondre à un topic ;
* liker ou disliker un message ;
* supprimer ses propres messages ;
* modifier ou supprimer ses propres topics ;
* voir son profile avec ses informations et son activité.

Il y a aussi une partie administrateur qui permet de gérer le site.

L’administrateur peut :

* voir les utilisateurs ;
* bannir ou débannir un utilisateur ;
* voir les topics ;
* changer l’état d’un topic : ouvert, fermé ou archivé ;
* supprimer un topic ;
* voir les messages ;
* supprimer un message.

---

## Fonctionnalité Partage

Dans le menu, il y a aussi une partie **Partage**.

Pour le moment cette fonctionnalité est affichée comme étant en cours de développement.

L’idée serait d’ajouter plus tard un système pour partager des documents, images, captures d’écran, PDF ou ressources utiles entre étudiants.

---

## Technologies utilisées

Pour ce projet, j’ai utilisé :

* HTML ;
* CSS ;
* JavaScript ;
* Node.js ;
* Express ;
* MySQL ;
* phpMyAdmin.

Le mot de passe est hashé avec `SHA-512` côté base de données avec `SHA2(..., 512)`.

---

## Architecture du projet

Voici l’organisation principale du projet :

```txt
livrables_forum-Ytalk-
│
├── backend
│   ├── controller
│   │   ├── controller_admin.js
│   │   ├── controller_auth.js
│   │   ├── controller_messages.js
│   │   ├── controller_profile.js
│   │   └── controller_topics.js
│   │
│   ├── routes
│   │   ├── route_admin.js
│   │   ├── route_auth.js
│   │   ├── route_messages.js
│   │   ├── route_profile.js
│   │   └── route_topics.js
│   │
│   ├── db.js
│   └── server.js
│
├── doc_db
│   ├── schema.sql
│   └── db.sql
│
├── frontend
│   ├── assets
│   ├── css_front
│   ├── html_front
│   └── js_front
│
├── package.json
└── README.md
```

---

## Fonctionnement rapide

Le frontend contient les pages HTML, le CSS et le JavaScript côté navigateur.

Le backend contient le serveur Node.js, les routes et les controllers.

Le fonctionnement est comme ça :

```txt
Frontend
→ appelle une route API
→ route backend
→ controller
→ db.js
→ base de données MySQL
```

Par exemple, quand on affiche les topics :

```txt
forum.html
→ forum.js
→ /api/topics
→ route_topics.js
→ controller_topics.js
→ MySQL
```

---

## Installation du projet

### 1. Installer les dépendances

Dans le dossier du projet, il faut lancer :

```bash
npm install
```

### 2. Lancer le serveur

Ensuite :

```bash
npm start
```

Normalement le serveur démarre sur :

```txt
http://localhost:3000
```

---

## Base de données

La base de données s’appelle :

```txt
ytalk_forum
```

Dans le dossier `doc_db`, il y a deux fichiers :

```txt
schema.sql
db.sql
```

`schema.sql` sert à créer les tables.

`db.sql` sert à ajouter les données de test.

L’ordre conseillé est :

```txt
1. importer schema.sql
2. importer db.sql
```

Le fichier `db.sql` supprime les anciennes données de test et remet une base propre avec des utilisateurs, topics, messages, tags et votes.

---

## Comptes de test

Compte administrateur :

```txt
pseudo : admin
mot de passe : Admin123!
```

Comptes utilisateurs :

```txt
pseudo : nathan
mot de passe : Azerty123!

pseudo : camille
mot de passe : Azerty123!

pseudo : yanis
mot de passe : Azerty123!

pseudo : emma
mot de passe : Azerty123!
```

Compte banni pour tester :

```txt
pseudo : banni_test
mot de passe : Azerty123!
```

---

## Pages principales

### Accueil

La page d’accueil présente le projet YTalk.

Elle change selon l’état de connexion :

* si l’utilisateur n’est pas connecté : bouton connexion et inscription ;
* si l’utilisateur est connecté : bouton profile et déconnexion ;
* si l’utilisateur est admin : bouton admin.

### Forum

La page forum permet de voir les topics.

On peut aussi rechercher un topic par :

* titre ;
* contenu ;
* tag ;
* auteur.

Il y a aussi une pagination pour afficher les topics par groupe.

### Topic

La page topic permet de lire une discussion.

On peut :

* voir le contenu du topic ;
* voir les messages ;
* répondre si on est connecté ;
* liker ou disliker un message ;
* supprimer son propre message ;
* modifier ou supprimer son topic si on en est l’auteur.

### Profile

La page profile affiche les informations de l’utilisateur connecté :

* pseudo ;
* email ;
* rôle ;
* nombre de topics créés ;
* nombre de messages envoyés ;
* messages likés ;
* topics créés.

### Admin

La page admin est accessible uniquement à l’administrateur.

Elle permet de gérer :

* les utilisateurs ;
* les topics ;
* les messages.

---

## États des topics

Les topics peuvent avoir plusieurs états :

```txt
ouvert
ferme
archive
```

Un topic ouvert permet d’envoyer des messages.

Un topic fermé reste visible mais on ne peut plus répondre.

Un topic archivé n’apparaît plus dans la liste principale du forum.

---

## Sécurité et vérifications

Le projet contient plusieurs vérifications :

* un utilisateur non connecté ne peut pas créer de topic ;
* un utilisateur non connecté ne peut pas répondre à un topic ;
* un utilisateur ne peut supprimer que ses propres messages ;
* le propriétaire d’un topic peut modifier ou supprimer son topic ;
* l’admin peut gérer tous les topics et messages ;
* un compte banni ne peut pas se connecter ;
* les mots de passe sont stockés en SHA-512.

---

## Ce qui fonctionne

Dans cette version, les fonctionnalités principales sont terminées :

* inscription ;
* connexion ;
* déconnexion ;
* affichage des topics ;
* recherche ;
* pagination ;
* création de topic ;
* affichage d’un topic ;
* ajout de messages ;
* likes / dislikes ;
* suppression de messages ;
* modification / suppression de topic ;
* profile utilisateur ;
* dashboard admin ;
* bannissement utilisateur ;
* page de future fonctionnalité Partage.

---

## Améliorations possibles

Plus tard, on pourrait ajouter :

* le partage de fichiers ;
* l’ajout d’images dans les messages ;
* un système de notification ;
* une vraie session sécurisée avec token ;
* une meilleure gestion des erreurs ;
* un design encore plus responsive ;
* une pagination aussi dans le dashboard admin.

---

## Conclusion

YTalk est un forum étudiant fonctionnel qui permet de centraliser les échanges entre élèves.

Le projet permet de discuter autour de topics, de répondre aux messages, de réagir avec des likes/dislikes et de gérer le forum avec un espace administrateur.

La partie Partage est prévue comme une amélioration future pour permettre aux étudiants de partager des documents et ressources.
