const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

const lienDeconnexion = document.getElementById("lien-deconnexion");

const btnUtilisateurs = document.getElementById("btn-utilisateurs");
const btnTopics = document.getElementById("btn-topics");
const btnMessages = document.getElementById("btn-messages");

const sectionUtilisateurs = document.getElementById("section-utilisateurs");
const sectionTopics = document.getElementById("section-topics");
const sectionMessages = document.getElementById("section-messages");

const listeUtilisateurs = document.getElementById("liste-utilisateurs");
const listeTopicsAdmin = document.getElementById("liste-topics-admin");
const listeMessagesAdmin = document.getElementById("liste-messages-admin");

const rechercheUtilisateurs = document.getElementById("recherche-utilisateurs");
const rechercheTopics = document.getElementById("recherche-topics");
const rechercheMessages = document.getElementById("recherche-messages");

const btnRechercheUtilisateurs = document.getElementById("btn-recherche-utilisateurs");
const btnRechercheTopics = document.getElementById("btn-recherche-topics");
const btnRechercheMessages = document.getElementById("btn-recherche-messages");

if (!utilisateur) {
    window.location.href = "login.html";
}

if (utilisateur && utilisateur.role !== "admin") {
    alert("Acces refuse, tu n'es pas administrateur");
    window.location.href = "index.html";
}

lienDeconnexion.addEventListener("click", function(e) {
    e.preventDefault();

    localStorage.removeItem("utilisateur");
    window.location.href = "index.html";
});

// afficher une seule section
function afficherSection(nomSection) {
    sectionUtilisateurs.style.display = "none";
    sectionTopics.style.display = "none";
    sectionMessages.style.display = "none";

    if (nomSection === "utilisateurs") {
        sectionUtilisateurs.style.display = "block";
        recupererUtilisateurs();
    }

    if (nomSection === "topics") {
        sectionTopics.style.display = "block";
        recupererTopicsAdmin();
    }

    if (nomSection === "messages") {
        sectionMessages.style.display = "block";
        recupererMessagesAdmin();
    }
}

// recuperer utilisateurs
function recupererUtilisateurs() {
    const recherche = rechercheUtilisateurs.value.trim();

    fetch("http://localhost:3000/api/admin/utilisateurs?utilisateur_id=" + utilisateur.id + "&recherche=" + encodeURIComponent(recherche))
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(data) {
            afficherUtilisateurs(data.utilisateurs);
        })
        .catch(function() {
            listeUtilisateurs.innerHTML = "<p>Erreur pendant le chargement des utilisateurs.</p>";
        });
}

function afficherUtilisateurs(utilisateurs) {
    listeUtilisateurs.innerHTML = "";

    if (!utilisateurs || utilisateurs.length === 0) {
        listeUtilisateurs.innerHTML = "<p>Aucun utilisateur trouvé.</p>";
        return;
    }

    utilisateurs.forEach(function(user) {
        const carte = document.createElement("div");
        carte.classList.add("admin-card");

        let texteBan = "Bannir";
        let prochainEtat = 1;

        if (user.banni === 1) {
            texteBan = "Débannir";
            prochainEtat = 0;
        }

        let boutonBan = `
            <button class="btn-danger" onclick="changerBanUtilisateur(${user.id}, ${prochainEtat})">
                ${texteBan}
            </button>
        `;

        if (Number(user.id) === Number(utilisateur.id)) {
            boutonBan = "<p>Tu ne peux pas bannir ton propre compte.</p>";
        }

        carte.innerHTML = `
            <h3>${user.pseudo}</h3>
            <p>Email : ${user.email}</p>
            <p>Rôle : ${user.role}</p>
            <p>Banni : ${user.banni === 1 ? "oui" : "non"}</p>

            <div class="admin-actions">
                ${boutonBan}
            </div>
        `;

        listeUtilisateurs.appendChild(carte);
    });
}

function changerBanUtilisateur(id, etatBan) {
    fetch("http://localhost:3000/api/admin/utilisateurs/" + id + "/ban", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id,
            banni: etatBan
        })
    })
    .then(function(reponse) {
        return reponse.json();
    })
    .then(function(data) {
        alert(data.message);
        recupererUtilisateurs();
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

// recuperer topics admin
function recupererTopicsAdmin() {
    const recherche = rechercheTopics.value.trim();

    fetch("http://localhost:3000/api/admin/topics?utilisateur_id=" + utilisateur.id + "&recherche=" + encodeURIComponent(recherche))
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(data) {
            afficherTopicsAdmin(data.topics);
        })
        .catch(function() {
            listeTopicsAdmin.innerHTML = "<p>Erreur pendant le chargement des topics.</p>";
        });
}

function afficherTopicsAdmin(topics) {
    listeTopicsAdmin.innerHTML = "";

    if (!topics || topics.length === 0) {
        listeTopicsAdmin.innerHTML = "<p>Aucun topic trouvé.</p>";
        return;
    }

    topics.forEach(function(topic) {
        const carte = document.createElement("div");
        carte.classList.add("admin-card");

        carte.innerHTML = `
            <h3>${topic.titre}</h3>
            <p>Auteur : ${topic.auteur}</p>
            <p>État actuel : ${topic.etat}</p>
            <p>${couperTexte(topic.contenu, 180)}</p>

            <div class="admin-actions">
                <select id="etat-topic-${topic.id}">
                    <option value="ouvert" ${topic.etat === "ouvert" ? "selected" : ""}>ouvert</option>
                    <option value="ferme" ${topic.etat === "ferme" ? "selected" : ""}>ferme</option>
                    <option value="archive" ${topic.etat === "archive" ? "selected" : ""}>archive</option>
                </select>

                <button class="btn-blue" onclick="changerEtatTopic(${topic.id})">
                    Changer état
                </button>

                <button class="btn-orange" onclick="voirTopic(${topic.id})">
                    Voir topic
                </button>

                <button class="btn-danger" onclick="supprimerTopicAdmin(${topic.id})">
                    Supprimer
                </button>
            </div>
        `;

        listeTopicsAdmin.appendChild(carte);
    });
}

function changerEtatTopic(topicId) {
    const selectEtat = document.getElementById("etat-topic-" + topicId);
    const nouvelEtat = selectEtat.value;

    fetch("http://localhost:3000/api/admin/topics/" + topicId + "/etat", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id,
            etat: nouvelEtat
        })
    })
    .then(function(reponse) {
        return reponse.json();
    })
    .then(function(data) {
        alert(data.message);
        recupererTopicsAdmin();
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

function supprimerTopicAdmin(topicId) {
    const confirmation = confirm("Tu veux vraiment supprimer ce topic ?");

    if (!confirmation) {
        return;
    }

    fetch("http://localhost:3000/api/admin/topics/" + topicId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id
        })
    })
    .then(function(reponse) {
        return reponse.json();
    })
    .then(function(data) {
        alert(data.message);
        recupererTopicsAdmin();
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

// recuperer messages admin
function recupererMessagesAdmin() {
    const recherche = rechercheMessages.value.trim();

    fetch("http://localhost:3000/api/admin/messages?utilisateur_id=" + utilisateur.id + "&recherche=" + encodeURIComponent(recherche))
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(data) {
            afficherMessagesAdmin(data.messages);
        })
        .catch(function() {
            listeMessagesAdmin.innerHTML = "<p>Erreur pendant le chargement des messages.</p>";
        });
}

function afficherMessagesAdmin(messages) {
    listeMessagesAdmin.innerHTML = "";

    if (!messages || messages.length === 0) {
        listeMessagesAdmin.innerHTML = "<p>Aucun message trouvé.</p>";
        return;
    }

    messages.forEach(function(message) {
        const carte = document.createElement("div");
        carte.classList.add("admin-card");

        carte.innerHTML = `
            <h3>Message de ${message.auteur}</h3>
            <p>Topic : ${message.topic_titre}</p>
            <p>${message.contenu}</p>

            <div class="admin-actions">
                <button class="btn-orange" onclick="voirTopic(${message.topic_id})">
                    Voir topic
                </button>

                <button class="btn-danger" onclick="supprimerMessageAdmin(${message.id})">
                    Supprimer
                </button>
            </div>
        `;

        listeMessagesAdmin.appendChild(carte);
    });
}

function supprimerMessageAdmin(messageId) {
    const confirmation = confirm("Tu veux vraiment supprimer ce message ?");

    if (!confirmation) {
        return;
    }

    fetch("http://localhost:3000/api/admin/messages/" + messageId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            utilisateur_id: utilisateur.id
        })
    })
    .then(function(reponse) {
        return reponse.json();
    })
    .then(function(data) {
        alert(data.message);
        recupererMessagesAdmin();
    })
    .catch(function() {
        alert("Erreur avec le serveur");
    });
}

function voirTopic(topicId) {
    window.location.href = "topic.html?id=" + topicId;
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

// boutons onglets
btnUtilisateurs.addEventListener("click", function() {
    afficherSection("utilisateurs");
});

btnTopics.addEventListener("click", function() {
    afficherSection("topics");
});

btnMessages.addEventListener("click", function() {
    afficherSection("messages");
});

// boutons recherche
btnRechercheUtilisateurs.addEventListener("click", function() {
    recupererUtilisateurs();
});

btnRechercheTopics.addEventListener("click", function() {
    recupererTopicsAdmin();
});

btnRechercheMessages.addEventListener("click", function() {
    recupererMessagesAdmin();
});

// recherche avec entree
rechercheUtilisateurs.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        recupererUtilisateurs();
    }
});

rechercheTopics.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        recupererTopicsAdmin();
    }
});

rechercheMessages.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        recupererMessagesAdmin();
    }
});

// lancement
afficherSection("utilisateurs");