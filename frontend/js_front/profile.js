const utilisateurLocal = JSON.parse(localStorage.getItem("utilisateur"));

const lienDeconnexion = document.getElementById("lien-deconnexion");

const avatarLettre = document.getElementById("avatar-lettre");
const pseudoUtilisateur = document.getElementById("pseudo-utilisateur");
const emailUtilisateur = document.getElementById("email-utilisateur");
const roleUtilisateur = document.getElementById("role-utilisateur");
const dateUtilisateur = document.getElementById("date-utilisateur");

const totalTopics = document.getElementById("total-topics");
const totalMessages = document.getElementById("total-messages");
const totalLikes = document.getElementById("total-likes");

const listeTopicsProfile = document.getElementById("liste-topics-profile");
const listeLikesProfile = document.getElementById("liste-likes-profile");

if (!utilisateurLocal) {
    window.location.href = "login.html";
}

lienDeconnexion.addEventListener("click", function(e) {
    e.preventDefault();

    localStorage.removeItem("utilisateur");
    window.location.href = "index.html";
});

// recuperer les infos du profile
function recupererProfile() {
    fetch("http://localhost:3000/api/profile/" + utilisateurLocal.id)
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
                alert(resultat.body.message);
                window.location.href = "index.html";
                return;
            }

            afficherProfile(resultat.body.utilisateur, resultat.body.stats);
            afficherTopics(resultat.body.topics);
            afficherMessagesLikes(resultat.body.messages_likes);
        })
        .catch(function() {
            alert("Erreur avec le serveur");
            window.location.href = "index.html";
        });
}

// afficher les infos principales
function afficherProfile(utilisateur, stats) {
    avatarLettre.textContent = utilisateur.pseudo.charAt(0).toUpperCase();

    pseudoUtilisateur.textContent = utilisateur.pseudo;
    emailUtilisateur.textContent = "Email : " + utilisateur.email;
    roleUtilisateur.textContent = "Rôle : " + utilisateur.role;
    dateUtilisateur.textContent = "Compte créé le : " + formaterDate(utilisateur.date_creation);

    totalTopics.textContent = stats.total_topics;
    totalMessages.textContent = stats.total_messages;
    totalLikes.textContent = stats.total_likes;
}

// afficher les topics crees
function afficherTopics(topics) {
    listeTopicsProfile.innerHTML = "";

    if (!topics || topics.length === 0) {
        listeTopicsProfile.innerHTML = "<p>Tu n'as pas encore créé de topic.</p>";
        return;
    }

    topics.forEach(function(topic) {
        const carte = document.createElement("div");
        carte.classList.add("profile-item");

        carte.innerHTML = `
            <h3>${topic.titre}</h3>
            <p>État : ${topic.etat}</p>
            <p>${couperTexte(topic.contenu, 170)}</p>

            <div class="profile-actions">
                <a href="topic.html?id=${topic.id}">Voir le topic</a>
            </div>
        `;

        listeTopicsProfile.appendChild(carte);
    });
}

// afficher les messages likes
function afficherMessagesLikes(messages) {
    listeLikesProfile.innerHTML = "";

    if (!messages || messages.length === 0) {
        listeLikesProfile.innerHTML = "<p>Tu n'as pas encore liké de message.</p>";
        return;
    }

    messages.forEach(function(message) {
        const carte = document.createElement("div");
        carte.classList.add("profile-item");

        carte.innerHTML = `
            <h3>Message de ${message.auteur}</h3>
            <p>Topic : ${message.topic_titre}</p>
            <p>${couperTexte(message.contenu, 200)}</p>

            <div class="profile-actions">
                <a href="topic.html?id=${message.topic_id}">Voir le topic</a>
            </div>
        `;

        listeLikesProfile.appendChild(carte);
    });
}

function couperTexte(texte, taille) {
    if (!texte) {
        return "";
    }

    if (texte.length <= taille) {
        return texte;
    }

    return texte.substring(0, taille) + "...";
}

function formaterDate(dateSql) {
    const date = new Date(dateSql);

    return date.toLocaleDateString("fr-FR") + " à " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

recupererProfile();