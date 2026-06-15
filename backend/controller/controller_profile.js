const db = require("../db");

// recuperer le profile d'un utilisateur
function recupererProfile(req, res) {
    const utilisateurId = req.params.id;

    if (!utilisateurId) {
        return res.status(400).json({
            message: "Utilisateur non reconnu"
        });
    }

    const requeteUtilisateur = `
        SELECT id, pseudo, email, role, banni, date_creation
        FROM utilisateurs
        WHERE id = ?
    `;

    db.query(requeteUtilisateur, [utilisateurId], function(erreurUtilisateur, resultatUtilisateur) {
        if (erreurUtilisateur) {
            return res.status(500).json({
                message: "Erreur pendant la recuperation du profile"
            });
        }

        if (resultatUtilisateur.length === 0) {
            return res.status(404).json({
                message: "Utilisateur introuvable"
            });
        }

        const utilisateur = resultatUtilisateur[0];

        const requeteStats = `
            SELECT
                (SELECT COUNT(*) FROM topics WHERE auteur_id = ?) AS total_topics,
                (SELECT COUNT(*) FROM messages WHERE auteur_id = ?) AS total_messages,
                (SELECT COUNT(*) FROM votes_messages WHERE utilisateur_id = ? AND vote = 'like') AS total_likes
        `;

        db.query(requeteStats, [utilisateurId, utilisateurId, utilisateurId], function(erreurStats, resultatStats) {
            if (erreurStats) {
                return res.status(500).json({
                    message: "Erreur pendant la recuperation des statistiques"
                });
            }

            const stats = resultatStats[0];

            const requeteTopics = `
                SELECT id, titre, contenu, etat, date_creation
                FROM topics
                WHERE auteur_id = ?
                ORDER BY date_creation DESC
            `;

            db.query(requeteTopics, [utilisateurId], function(erreurTopics, topics) {
                if (erreurTopics) {
                    return res.status(500).json({
                        message: "Erreur pendant la recuperation des topics"
                    });
                }

                const requeteMessagesLikes = `
                    SELECT
                        messages.id,
                        messages.contenu,
                        messages.date_creation,
                        messages.topic_id,
                        topics.titre AS topic_titre,
                        utilisateurs.pseudo AS auteur
                    FROM votes_messages
                    INNER JOIN messages ON votes_messages.message_id = messages.id
                    INNER JOIN topics ON messages.topic_id = topics.id
                    INNER JOIN utilisateurs ON messages.auteur_id = utilisateurs.id
                    WHERE votes_messages.utilisateur_id = ?
                    AND votes_messages.vote = 'like'
                    ORDER BY votes_messages.date_creation DESC
                `;

                db.query(requeteMessagesLikes, [utilisateurId], function(erreurLikes, messagesLikes) {
                    if (erreurLikes) {
                        return res.status(500).json({
                            message: "Erreur pendant la recuperation des likes"
                        });
                    }

                    res.status(200).json({
                        utilisateur: utilisateur,
                        stats: stats,
                        topics: topics,
                        messages_likes: messagesLikes
                    });
                });
            });
        });
    });
}

module.exports = {
    recupererProfile
};