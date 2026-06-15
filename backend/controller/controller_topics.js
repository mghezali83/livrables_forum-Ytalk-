const db = require("../db");

// recuperer les topics avec recherche, tag, auteur et pagination
function recupererTopics(req, res) {
    const recherche = req.query.recherche || "";
    const limite = parseInt(req.query.limite) || 10;
    const page = parseInt(req.query.page) || 1;

    const offset = (page - 1) * limite;
    const rechercheSql = "%" + recherche + "%";

    let requete = `
        SELECT 
            topics.id,
            topics.titre,
            topics.contenu,
            topics.etat,
            topics.date_creation,
            utilisateurs.pseudo AS auteur,
            GROUP_CONCAT(tags.nom SEPARATOR ', ') AS tags
        FROM topics
        INNER JOIN utilisateurs ON topics.auteur_id = utilisateurs.id
        LEFT JOIN topic_tags ON topics.id = topic_tags.topic_id
        LEFT JOIN tags ON topic_tags.tag_id = tags.id
        WHERE topics.etat != 'archive'
        AND (
            topics.titre LIKE ?
            OR topics.contenu LIKE ?
            OR tags.nom LIKE ?
            OR utilisateurs.pseudo LIKE ?
        )
        GROUP BY topics.id
        ORDER BY topics.date_creation DESC
        LIMIT ? OFFSET ?
    `;

    db.query(requete, [rechercheSql, rechercheSql, rechercheSql, rechercheSql, limite, offset], function(erreur, topics) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la recuperation des topics"
            });
        }

        let requeteTotal = `
            SELECT COUNT(DISTINCT topics.id) AS total
            FROM topics
            INNER JOIN utilisateurs ON topics.auteur_id = utilisateurs.id
            LEFT JOIN topic_tags ON topics.id = topic_tags.topic_id
            LEFT JOIN tags ON topic_tags.tag_id = tags.id
            WHERE topics.etat != 'archive'
            AND (
                topics.titre LIKE ?
                OR topics.contenu LIKE ?
                OR tags.nom LIKE ?
                OR utilisateurs.pseudo LIKE ?
            )
        `;

        db.query(requeteTotal, [rechercheSql, rechercheSql, rechercheSql, rechercheSql], function(erreurTotal, resultatTotal) {
            if (erreurTotal) {
                return res.status(500).json({
                    message: "Erreur pendant le comptage des topics"
                });
            }

            const total = resultatTotal[0].total;
            const totalPages = Math.ceil(total / limite);

            res.status(200).json({
                topics: topics,
                page: page,
                limite: limite,
                total: total,
                totalPages: totalPages
            });
        });
    });
}

// recuperer un topic avec son id
function recupererTopicParId(req, res) {
    const topicId = req.params.id;

    const requete = `
        SELECT
            topics.id,
            topics.titre,
            topics.contenu,
            topics.etat,
            topics.date_creation,
            topics.auteur_id,
            utilisateurs.pseudo AS auteur,
            GROUP_CONCAT(tags.nom SEPARATOR ', ') AS tags
        FROM topics
        INNER JOIN utilisateurs ON topics.auteur_id = utilisateurs.id
        LEFT JOIN topic_tags ON topics.id = topic_tags.topic_id
        LEFT JOIN tags ON topic_tags.tag_id = tags.id
        WHERE topics.id = ?
        AND topics.etat != 'archive'
        GROUP BY topics.id
    `;

    db.query(requete, [topicId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la recuperation du topic"
            });
        }

        if (resultat.length === 0) {
            return res.status(404).json({
                message: "Topic introuvable"
            });
        }

        res.status(200).json({
            topic: resultat[0]
        });
    });
}

// creer un topic
function creerTopic(req, res) {
    const titre = req.body.titre;
    const contenu = req.body.contenu;
    const tags = req.body.tags;
    const auteurId = req.body.auteur_id;

    if (!titre || !contenu || !auteurId) {
        return res.status(400).json({
            message: "Le titre, le contenu et l'auteur sont obligatoires"
        });
    }

    const requeteTopic = `
        INSERT INTO topics (titre, contenu, auteur_id, etat)
        VALUES (?, ?, ?, 'ouvert')
    `;

    db.query(requeteTopic, [titre, contenu, auteurId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la creation du topic"
            });
        }

        const topicId = resultat.insertId;

        if (!tags || tags.length === 0) {
            return res.status(201).json({
                message: "Topic cree avec succes",
                topic_id: topicId
            });
        }

        ajouterTagsAuTopic(topicId, tags, function(erreurTags) {
            if (erreurTags) {
                return res.status(500).json({
                    message: "Topic cree, mais erreur pendant l'ajout des tags"
                });
            }

            res.status(201).json({
                message: "Topic cree avec succes",
                topic_id: topicId
            });
        });
    });
}

// modifier un topic
function modifierTopic(req, res) {
    const topicId = req.params.id;
    const titre = req.body.titre;
    const contenu = req.body.contenu;
    const tags = req.body.tags;
    const utilisateurId = req.body.utilisateur_id;
    const role = req.body.role;

    if (!titre || !contenu || !utilisateurId || !role) {
        return res.status(400).json({
            message: "Informations manquantes"
        });
    }

    const requeteVerif = `
        SELECT auteur_id
        FROM topics
        WHERE id = ?
    `;

    db.query(requeteVerif, [topicId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la verification du topic"
            });
        }

        if (resultat.length === 0) {
            return res.status(404).json({
                message: "Topic introuvable"
            });
        }

        const auteurTopicId = resultat[0].auteur_id;
        const estAuteur = Number(auteurTopicId) === Number(utilisateurId);
        const estAdmin = role === "admin";

        if (!estAuteur && !estAdmin) {
            return res.status(403).json({
                message: "Tu n'as pas le droit de modifier ce topic"
            });
        }

        const requeteModification = `
            UPDATE topics
            SET titre = ?, contenu = ?
            WHERE id = ?
        `;

        db.query(requeteModification, [titre, contenu, topicId], function(erreurModification) {
            if (erreurModification) {
                return res.status(500).json({
                    message: "Erreur pendant la modification du topic"
                });
            }

            const requeteSupprTags = `
                DELETE FROM topic_tags
                WHERE topic_id = ?
            `;

            db.query(requeteSupprTags, [topicId], function(erreurTags) {
                if (erreurTags) {
                    return res.status(500).json({
                        message: "Topic modifie, mais erreur avec les tags"
                    });
                }

                if (!tags || tags.length === 0) {
                    return res.status(200).json({
                        message: "Topic modifie avec succes"
                    });
                }

                ajouterTagsAuTopic(topicId, tags, function(erreurAjoutTags) {
                    if (erreurAjoutTags) {
                        return res.status(500).json({
                            message: "Topic modifie, mais erreur pendant l'ajout des tags"
                        });
                    }

                    res.status(200).json({
                        message: "Topic modifie avec succes"
                    });
                });
            });
        });
    });
}

// supprimer un topic
function supprimerTopic(req, res) {
    const topicId = req.params.id;
    const utilisateurId = req.body.utilisateur_id;
    const role = req.body.role;

    if (!utilisateurId || !role) {
        return res.status(400).json({
            message: "Utilisateur non reconnu"
        });
    }

    const requeteVerif = `
        SELECT auteur_id
        FROM topics
        WHERE id = ?
    `;

    db.query(requeteVerif, [topicId], function(erreur, resultat) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur pendant la verification du topic"
            });
        }

        if (resultat.length === 0) {
            return res.status(404).json({
                message: "Topic introuvable"
            });
        }

        const auteurTopicId = resultat[0].auteur_id;
        const estAuteur = Number(auteurTopicId) === Number(utilisateurId);
        const estAdmin = role === "admin";

        if (!estAuteur && !estAdmin) {
            return res.status(403).json({
                message: "Tu n'as pas le droit de supprimer ce topic"
            });
        }

        const requeteSuppression = `
            DELETE FROM topics
            WHERE id = ?
        `;

        db.query(requeteSuppression, [topicId], function(erreurSuppression) {
            if (erreurSuppression) {
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

// fonction pour ajouter les tags au topic
function ajouterTagsAuTopic(topicId, tags, callback) {
    let tagsPropres = [];

    tags.forEach(function(tag) {
        let tagPropre = tag.trim().toLowerCase();

        if (tagPropre !== "" && !tagsPropres.includes(tagPropre)) {
            tagsPropres.push(tagPropre);
        }
    });

    if (tagsPropres.length === 0) {
        return callback(null);
    }

    let compteur = 0;
    let erreurTrouvee = null;

    tagsPropres.forEach(function(tag) {
        const requeteTag = `
            INSERT IGNORE INTO tags (nom)
            VALUES (?)
        `;

        db.query(requeteTag, [tag], function(erreurInsertTag) {
            if (erreurInsertTag) {
                erreurTrouvee = erreurInsertTag;
            }

            const requeteRecupTag = `
                SELECT id FROM tags WHERE nom = ?
            `;

            db.query(requeteRecupTag, [tag], function(erreurRecupTag, resultatTag) {
                if (erreurRecupTag || resultatTag.length === 0) {
                    erreurTrouvee = erreurRecupTag;
                    compteur++;

                    if (compteur === tagsPropres.length) {
                        callback(erreurTrouvee);
                    }

                    return;
                }

                const tagId = resultatTag[0].id;

                const requeteLiaison = `
                    INSERT IGNORE INTO topic_tags (topic_id, tag_id)
                    VALUES (?, ?)
                `;

                db.query(requeteLiaison, [topicId, tagId], function(erreurLiaison) {
                    if (erreurLiaison) {
                        erreurTrouvee = erreurLiaison;
                    }

                    compteur++;

                    if (compteur === tagsPropres.length) {
                        callback(erreurTrouvee);
                    }
                });
            });
        });
    });
}

module.exports = {
    recupererTopics,
    recupererTopicParId,
    creerTopic,
    modifierTopic,
    supprimerTopic
};