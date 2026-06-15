const db = require("../db");

// recuperer les messages d'un topic
function recupererMessagesTopic(req, res) {
    const topicId = req.params.topicId;
    const ordre = req.query.ordre || "recent";

    let tri = "messages.date_creation DESC";

    if (ordre === "ancien") {
        tri = "messages.date_creation ASC";
    }

    if (ordre === "popularite") {
        tri = "score DESC, messages.date_creation DESC";
    }

    const requete = `
        SELECT
            messages.id,
            messages.topic_id,
            messages.auteur_id,
            messages.contenu,
            messages.date_creation,
            utilisateurs.pseudo AS auteur,
            COALESCE(SUM(CASE WHEN votes_messages.vote = 'like' THEN 1 ELSE 0 END), 0) AS likes,
            COALESCE(SUM(CASE WHEN votes_messages.vote = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes,
            COALESCE(SUM(CASE 
                WHEN votes_messages.vote = 'like' THEN 1 
                WHEN votes_messages.vote = 'dislike' THEN -1 
                ELSE 0 
            END), 0) AS score
        FROM messages
        INNER JOIN utilisateurs ON messages.auteur_id = utilisateurs.id
        LEFT JOIN votes_messages ON messages.id = votes_messages.message_id
        WHERE messages.topic_id = ?
        GROUP BY messages.id
        ORDER BY ${tri}
    `;

    db.query(requete, [topicId], function(erreur, messages) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la recuperation des messages"
            });
        }

        res.status(200).json({
            messages: messages
        });
    });
}

// envoyer un message dans un topic
function envoyerMessage(req, res) {
    const topicId = req.body.topic_id;
    const auteurId = req.body.auteur_id;
    const contenu = req.body.contenu;

    if (!topicId || !auteurId || !contenu) {
        return res.status(400).json({
            message: "Le message est incomplet"
        });
    }

    const requeteVerifTopic = `
        SELECT etat FROM topics WHERE id = ?
    `;

    db.query(requeteVerifTopic, [topicId], function(erreurTopic, resultatTopic) {
        if (erreurTopic) {
            return res.status(500).json({
                message: "Erreur pendant la verification du topic"
            });
        }

        if (resultatTopic.length === 0) {
            return res.status(404).json({
                message: "Topic introuvable"
            });
        }

        if (resultatTopic[0].etat !== "ouvert") {
            return res.status(403).json({
                message: "Ce topic est ferme, tu ne peux plus envoyer de message"
            });
        }

        const requeteAjout = `
            INSERT INTO messages (topic_id, auteur_id, contenu)
            VALUES (?, ?, ?)
        `;

        db.query(requeteAjout, [topicId, auteurId, contenu], function(erreurAjout) {
            if (erreurAjout) {
                return res.status(500).json({
                    message: "Erreur pendant l'envoi du message"
                });
            }

            res.status(201).json({
                message: "Message envoye"
            });
        });
    });
}

// voter sur un message
function voterMessage(req, res) {
    const messageId = req.params.id;
    const utilisateurId = req.body.utilisateur_id;
    const vote = req.body.vote;

    if (!messageId || !utilisateurId || !vote) {
        return res.status(400).json({
            message: "Vote incomplet"
        });
    }

    if (vote !== "like" && vote !== "dislike") {
        return res.status(400).json({
            message: "Vote invalide"
        });
    }

    const requeteVerifMessage = `
        SELECT id FROM messages WHERE id = ?
    `;

    db.query(requeteVerifMessage, [messageId], function(erreurMessage, resultatMessage) {
        if (erreurMessage) {
            return res.status(500).json({
                message: "Erreur pendant la verification du message"
            });
        }

        if (resultatMessage.length === 0) {
            return res.status(404).json({
                message: "Message introuvable"
            });
        }

        const requeteVerifVote = `
            SELECT id, vote 
            FROM votes_messages 
            WHERE message_id = ? AND utilisateur_id = ?
        `;

        db.query(requeteVerifVote, [messageId, utilisateurId], function(erreurVote, resultatVote) {
            if (erreurVote) {
                return res.status(500).json({
                    message: "Erreur pendant la verification du vote"
                });
            }

            // aucun vote avant, donc on ajoute
            if (resultatVote.length === 0) {
                const requeteAjoutVote = `
                    INSERT INTO votes_messages (message_id, utilisateur_id, vote)
                    VALUES (?, ?, ?)
                `;

                db.query(requeteAjoutVote, [messageId, utilisateurId, vote], function(erreurAjout) {
                    if (erreurAjout) {
                        return res.status(500).json({
                            message: "Erreur pendant l'ajout du vote"
                        });
                    }

                    return res.status(201).json({
                        message: "Vote ajoute"
                    });
                });

                return;
            }

            const voteActuel = resultatVote[0].vote;

            // si l'utilisateur clique sur le meme vote, on le retire
            if (voteActuel === vote) {
                const requeteSupprimerVote = `
                    DELETE FROM votes_messages
                    WHERE message_id = ? AND utilisateur_id = ?
                `;

                db.query(requeteSupprimerVote, [messageId, utilisateurId], function(erreurSuppression) {
                    if (erreurSuppression) {
                        return res.status(500).json({
                            message: "Erreur pendant la suppression du vote"
                        });
                    }

                    return res.status(200).json({
                        message: "Vote retire"
                    });
                });

                return;
            }

            // sinon on remplace like par dislike ou inversement
            const requeteModifierVote = `
                UPDATE votes_messages
                SET vote = ?
                WHERE message_id = ? AND utilisateur_id = ?
            `;

            db.query(requeteModifierVote, [vote, messageId, utilisateurId], function(erreurModification) {
                if (erreurModification) {
                    return res.status(500).json({
                        message: "Erreur pendant la modification du vote"
                    });
                }

                res.status(200).json({
                    message: "Vote modifie"
                });
            });
        });
    });
}

// supprimer un message
function supprimerMessage(req, res) {
    const messageId = req.params.id;
    const utilisateurId = req.body.utilisateur_id;
    const role = req.body.role;

    if (!utilisateurId || !role) {
        return res.status(400).json({
            message: "Utilisateur non reconnu"
        });
    }

    const requeteVerif = `
        SELECT 
            messages.id,
            messages.auteur_id AS auteur_message_id,
            topics.auteur_id AS auteur_topic_id
        FROM messages
        INNER JOIN topics ON messages.topic_id = topics.id
        WHERE messages.id = ?
    `;

    db.query(requeteVerif, [messageId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la verification du message"
            });
        }

        if (resultat.length === 0) {
            return res.status(404).json({
                message: "Message introuvable"
            });
        }

        const message = resultat[0];

        const estAuteurMessage = Number(message.auteur_message_id) === Number(utilisateurId);
        const estAuteurTopic = Number(message.auteur_topic_id) === Number(utilisateurId);
        const estAdmin = role === "admin";

        if (!estAuteurMessage && !estAuteurTopic && !estAdmin) {
            return res.status(403).json({
                message: "Tu n'as pas le droit de supprimer ce message"
            });
        }

        const requeteSuppression = `
            DELETE FROM messages
            WHERE id = ?
        `;

        db.query(requeteSuppression, [messageId], function(erreurSuppression) {
            if (erreurSuppression) {
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
    recupererMessagesTopic,
    envoyerMessage,
    supprimerMessage,
    voterMessage
};