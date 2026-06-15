const params = new URLSearchParams(window.location.search);
const topicId = params.get("id");

const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

const titreTopic = document.getElementById("titre-topic");
const contenuTopic = document.getElementById("contenu-topic");
const auteurTopic = document.getElementById("auteur-topic");
const dateTopic = document.getElementById("date-topic");
const etatTopic = document.getElementById("etat-topic");
const tagsTopic = document.getElementById("tags-topic");
const topicActions = document.getElementById("topic-actions");

const listeMessages = document.getElementById("liste-messages");
const triMessages = document.getElementById("tri-messages");

const zoneFormMessage = document.getElementById("zone-form-message");
const formMessage = document.getElementById("form-message");
const contenuMessage = document.getElementById("contenu-message");
const messageInfo = document.getElementById("message-info");

const lienCreation = document.getElementById("lien-creation");
const lienDeconnexion = document.getElementById("lien-deconnexion");

let topicActuel = null;

if (!topicId) {
    window.location.href = "forum.html";
}

if (!utilisateur) {
    lienCreation.style.display = "none";
    lienDeconnexion.textContent = "Connexion";
    lienDeconnexion.href = "login.html";

    zoneFormMessage.innerHTML = `
        <div class="form-message-card">
            <h2>Connexion requise</h2>
            <p>Tu dois être connecté pour répondre à ce topic.</p>
            <br>
            <a href="login.html" class="bouton-lien">Se connecter</a>
        </div>
    `;
} else {
    lienDeconnexion.addEventListener("click", function(e) {
        e.preventDefault();
        localStorage.removeItem("utilisateur");
        window.location.href = "index.html";
    });
}

function recupererTopic() {
    fetch("http://localhost:3000/api/topics/" + topicId)
        .then(function(reponse) {
            return reponse.json().then(function(data) {
                return {
                    status: reponse.status,
                    body: data
                };
            });
        })
        .then(function(resultat) {
            if (resultat.status !== 200) {
                titreTopic.textContent = "Topic introuvable";
                contenuTopic.textContent = resultat.body.message;
                zoneFormMessage.style.display = "none";
                return;
            }

            topicActuel = resultat.body.topic;

            afficherTopic(topicActuel);
            afficherActionsTopic();
            gererFormulaireMessage();
            recupererMessages();
        })
        .catch(function() {
            titreTopic.textContent = "Erreur";
            contenuTopic.textContent = "Impossible de charger le topic.";
        });
}

function afficherTopic(topic) {
    titreTopic.textContent = topic.titre;
    contenuTopic.textContent = topic.contenu;
    auteurTopic.textContent = "Auteur : " + topic.auteur;
    dateTopic.textContent = "Date : " + formaterDate(topic.date_creation);
    etatTopic.textContent = "État : " + topic.etat;

    if (topic.tags) {
        tagsTopic.textContent = "Tags : " + topic.tags;
    } else {
        tagsTopic.textContent = "Tags : aucun";
    }
}

function afficherActionsTopic() {
    topicActions.innerHTML = "";

    if (!utilisateur || !topicActuel) {
        return;
    }

    const peutGerer = Number(topicActuel.auteur_id) === Number(utilisateur.id) || utilisateur.role === "admin";

    if (!peutGerer) {
        return;
    }

    topicActions.innerHTML = `
        <a href="modification_topic.html?id=${topicId}" class="btn-modifier-topic">
            Modifier le topic
        </a>

        <button class="btn-supprimer-topic" onclick="supprimerTopic()">
            Supprimer le topic
        </button>
    `;
}

function supprimerTopic() {
    const confirmation = confirm("Tu veux vraiment supprimer ce topic ? Tous les messages seront aussi supprimés.");

    if (!confirmation) {
        return;
    }

    fetch("http://localhost:3000/api/topics/" + topicId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id,
            role: utilisateur.role
        })
    })
    .then(function(reponse) {
        return reponse.json().then(function(data) {
            return {
                status: reponse.status,
                body: data
            };
        });
    })
    .then(function(resultat) {
        alert(resultat.body.message);

        if (resultat.status === 200) {
            window.location.href = "forum.html";
        }
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

function recupererMessages() {
    const ordre = triMessages.value;

    fetch("http://localhost:3000/api/messages/topic/" + topicId + "?ordre=" + ordre)
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(data) {
            afficherMessages(data.messages);
        })
        .catch(function() {
            listeMessages.innerHTML = "<p>Erreur pendant le chargement des messages.</p>";
        });
}

function afficherMessages(messages) {
    listeMessages.innerHTML = "";

    if (messages.length === 0) {
        listeMessages.innerHTML = "<p>Aucun message pour le moment.</p>";
        return;
    }

    messages.forEach(function(message) {
        const carte = document.createElement("div");
        carte.classList.add("message-card");

        const peutSupprimer = utilisateur && (
            Number(message.auteur_id) === Number(utilisateur.id) ||
            Number(topicActuel.auteur_id) === Number(utilisateur.id) ||
            utilisateur.role === "admin"
        );

        let boutonSupprimer = "";
        let boutonsVote = "";

        if (utilisateur) {
            boutonsVote = `
                <button class="btn-like" onclick="voterMessage(${message.id}, 'like')">
                    Like
                </button>

                <button class="btn-dislike" onclick="voterMessage(${message.id}, 'dislike')">
                    Dislike
                </button>
            `;
        }

        if (peutSupprimer) {
            boutonSupprimer = `
                <button class="btn-supprimer-message" onclick="supprimerMessage(${message.id})">
                    Supprimer
                </button>
            `;
        }

        carte.innerHTML = `
            <div class="message-header">
                <span class="message-auteur">${message.auteur}</span>
                <span>${formaterDate(message.date_creation)}</span>
            </div>

            <p class="message-contenu">${message.contenu}</p>

            <div class="message-score">
                <span>Likes : ${message.likes}</span>
                <span>Dislikes : ${message.dislikes}</span>
            </div>

            <div class="message-actions">
                ${boutonsVote}
                ${boutonSupprimer}
            </div>
        `;

        listeMessages.appendChild(carte);
    });
}

function voterMessage(messageId, vote) {
    if (!utilisateur) {
        alert("Tu dois etre connecte pour voter");
        return;
    }

    fetch("http://localhost:3000/api/messages/" + messageId + "/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id,
            vote: vote
        })
    })
    .then(function(reponse) {
        return reponse.json().then(function(data) {
            return {
                status: reponse.status,
                body: data
            };
        });
    })
    .then(function(resultat) {
        if (resultat.status === 200 || resultat.status === 201) {
            recupererMessages();
        } else {
            alert(resultat.body.message);
        }
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

function supprimerMessage(messageId) {
    const confirmation = confirm("Tu veux vraiment supprimer ce message ?");

    if (!confirmation) {
        return;
    }

    fetch("http://localhost:3000/api/messages/" + messageId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id,
            role: utilisateur.role
        })
    })
    .then(function(reponse) {
        return reponse.json().then(function(data) {
            return {
                status: reponse.status,
                body: data
            };
        });
    })
    .then(function(resultat) {
        alert(resultat.body.message);

        if (resultat.status === 200) {
            recupererMessages();
        }
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

function gererFormulaireMessage() {
    if (!utilisateur) {
        return;
    }

    if (topicActuel.etat !== "ouvert") {
        zoneFormMessage.innerHTML = `
            <div class="form-message-card">
                <h2>Topic fermé</h2>
                <p>Ce topic est fermé, il n'est plus possible de répondre.</p>
            </div>
        `;
    }
}

if (formMessage) {
    formMessage.addEventListener("submit", function(e) {
        e.preventDefault();

        const contenu = contenuMessage.value.trim();

        if (contenu === "") {
            messageInfo.textContent = "Ton message est vide";
            messageInfo.style.color = "#ff8c00";
            return;
        }

        fetch("http://localhost:3000/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic_id: topicId,
                auteur_id: utilisateur.id,
                contenu: contenu
            })
        })
        .then(function(reponse) {
            return reponse.json().then(function(data) {
                return {
                    status: reponse.status,
                    body: data
                };
            });
        })
        .then(function(resultat) {
            messageInfo.textContent = resultat.body.message;

            if (resultat.status === 201) {
                messageInfo.style.color = "#00aaff";
                contenuMessage.value = "";
                recupererMessages();
            } else {
                messageInfo.style.color = "#ff8c00";
            }
        })
        .catch(function() {
            messageInfo.textContent = "Erreur avec le serveur";
            messageInfo.style.color = "#ff8c00";
        });
    });
}

triMessages.addEventListener("change", function() {
    recupererMessages();
});

function formaterDate(dateSql) {
    const date = new Date(dateSql);

    return date.toLocaleDateString("fr-FR") + " à " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

recupererTopic();