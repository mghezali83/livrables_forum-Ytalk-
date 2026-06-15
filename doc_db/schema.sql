DROP DATABASE IF EXISTS ytalk_forum;
CREATE DATABASE ytalk_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ytalk_forum;

-- table des utilisateurs
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    mot_de_passe CHAR(128) NOT NULL,
    role ENUM('utilisateur', 'admin') DEFAULT 'utilisateur',
    banni BOOLEAN DEFAULT FALSE,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- table des topics
CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    contenu TEXT NOT NULL,
    auteur_id INT NOT NULL,
    etat ENUM('ouvert', 'ferme', 'archive') DEFAULT 'ouvert',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (auteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- table des tags / categories
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

-- liaison entre les topics et les tags
CREATE TABLE topic_tags (
    topic_id INT NOT NULL,
    tag_id INT NOT NULL,

    PRIMARY KEY (topic_id, tag_id),

    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- table des messages
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    auteur_id INT NOT NULL,
    contenu TEXT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modification DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (auteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- table like ou pas 
CREATE TABLE votes_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    utilisateur_id INT NOT NULL,
    vote ENUM('like', 'dislike') NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY vote_unique (message_id, utilisateur_id),

    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);