const db = require("../db");

// petite verification pour savoir si la personne est admin
function verifierAdmin(req, res, callback) {
    const utilisateurId = req.query.utilisateur_id || req.body.utilisateur_id;

    if (!utilisateurId) {
        return res.status(400).json({
            message: "Utilisateur non reconnu"
        });
    }

    const requete = `
        SELECT role
        FROM utilisateurs
        WHERE id = ?
    `;

    db.query(requete, [utilisateurId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la verification admin"
            });
        }

        if (resultat.length === 0) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        if (resultat[0].role !== "admin") {
            return res.status(403).json({
                message: "Acces refuse, tu n'es pas admin"
            });
        }

        callback();
    });
}

// recuperer les utilisateurs pour l'admin
function recupererUtilisateursAdmin(req, res) {
    verifierAdmin(req, res, function() {
        const recherche = req.query.recherche || "";
        const rechercheSql = "%" + recherche + "%";

        const requete = `
            SELECT id, pseudo, email, role, banni, date_creation
            FROM utilisateurs
            WHERE pseudo LIKE ?
            OR email LIKE ?
            OR role LIKE ?
            ORDER BY date_creation DESC
        `;

        db.query(requete, [rechercheSql, rechercheSql, rechercheSql], function(erreur, utilisateurs) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la recuperation des utilisateurs"
                });
            }

            res.status(200).json({
                utilisateurs: utilisateurs
            });
        });
    });
}

// bannir ou debannir un utilisateur
function changerBanUtilisateur(req, res) {
    verifierAdmin(req, res, function() {
        const utilisateurCibleId = req.params.id;
        const banni = req.body.banni;

        if (banni === undefined) {
            return res.status(400).json({
                message: "Etat du ban manquant"
            });
        }

        const requete = `
            UPDATE utilisateurs
            SET banni = ?
            WHERE id = ?
        `;

        db.query(requete, [banni, utilisateurCibleId], function(erreur) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la modification du ban"
                });
            }

            res.status(200).json({
                message: "Utilisateur mis a jour"
            });
        });
    });
}

// recuperer les topics pour l'admin
function recupererTopicsAdmin(req, res) {
    verifierAdmin(req, res, function() {
        const recherche = req.query.recherche || "";
        const rechercheSql = "%" + recherche + "%";

        const requete = `
            SELECT
                topics.id,
                topics.titre,
                topics.contenu,
                topics.etat,
                topics.date_creation,
                utilisateurs.pseudo AS auteur
            FROM topics
            INNER JOIN utilisateurs ON topics.auteur_id = utilisateurs.id
            WHERE topics.titre LIKE ?
            OR topics.contenu LIKE ?
            OR topics.etat LIKE ?
            OR utilisateurs.pseudo LIKE ?
            ORDER BY topics.date_creation DESC
        `;

        db.query(requete, [rechercheSql, rechercheSql, rechercheSql, rechercheSql], function(erreur, topics) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la recuperation des topics"
                });
            }

            res.status(200).json({
                topics: topics
            });
        });
    });
}

// changer l'etat d'un topic
function changerEtatTopic(req, res) {
    verifierAdmin(req, res, function() {
        const topicId = req.params.id;
        const etat = req.body.etat;

        if (etat !== "ouvert" && etat !== "ferme" && etat !== "archive") {
            return res.status(400).json({
                message: "Etat invalide"
            });
        }

        const requete = `
            UPDATE topics
            SET etat = ?
            WHERE id = ?
        `;

        db.query(requete, [etat, topicId], function(erreur) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant le changement d'etat"
                });
            }

            res.status(200).json({
                message: "Etat du topic modifie"
            });
        });
    });
}

// supprimer un topic
function supprimerTopicAdmin(req, res) {
    verifierAdmin(req, res, function() {
        const topicId = req.params.id;

        const requete = `
            DELETE FROM topics
            WHERE id = ?
        `;

        db.query(requete, [topicId], function(erreur) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la suppression du topic"
                });
            }

            res.status(200).json({
                message: "Topic supprime"
            });
        });
    });
}

// recuperer les messages pour l'admin
function recupererMessagesAdmin(req, res) {
    verifierAdmin(req, res, function() {
        const recherche = req.query.recherche || "";
        const rechercheSql = "%" + recherche + "%";

        const requete = `
            SELECT
                messages.id,
                messages.contenu,
                messages.date_creation,
                messages.topic_id,
                utilisateurs.pseudo AS auteur,
                topics.titre AS topic_titre
            FROM messages
            INNER JOIN utilisateurs ON messages.auteur_id = utilisateurs.id
            INNER JOIN topics ON messages.topic_id = topics.id
            WHERE messages.contenu LIKE ?
            OR utilisateurs.pseudo LIKE ?
            OR topics.titre LIKE ?
            ORDER BY messages.date_creation DESC
        `;

        db.query(requete, [rechercheSql, rechercheSql, rechercheSql], function(erreur, messages) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la recuperation des messages"
                });
            }

            res.status(200).json({
                messages: messages
            });
        });
    });
}

// supprimer un message
function supprimerMessageAdmin(req, res) {
    verifierAdmin(req, res, function() {
        const messageId = req.params.id;

        const requete = `
            DELETE FROM messages
            WHERE id = ?
        `;

        db.query(requete, [messageId], function(erreur) {
            if (erreur) {
                return res.status(500).json({
                    message: "Erreur pendant la suppression du message"
                });
            }

            res.status(200).json({
                message: "Message supprime"
            });
        });
    });
}

module.exports = {
    recupererUtilisateursAdmin,
    changerBanUtilisateur,
    recupererTopicsAdmin,
    changerEtatTopic,
    supprimerTopicAdmin,
    recupererMessagesAdmin,
    supprimerMessageAdmin
};