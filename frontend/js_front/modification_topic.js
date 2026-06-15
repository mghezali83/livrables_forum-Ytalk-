const params = new URLSearchParams(window.location.search);
const topicId = params.get("id");

const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

const formModification = document.getElementById("form-modification-topic");
const titreInput = document.getElementById("titre");
const contenuInput = document.getElementById("contenu");
const tagsInput = document.getElementById("tags");
const message = document.getElementById("message");
const lienDeconnexion = document.getElementById("lien-deconnexion");

let topicActuel = null;

if (!topicId) {
    window.location.href = "forum.html";
}

if (!utilisateur) {
    window.location.href = "login.html";
}

lienDeconnexion.addEventListener("click", function(e) {
    e.preventDefault();

    localStorage.removeItem("utilisateur");
    window.location.href = "index.html";
});

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
                alert(resultat.body.message);
                window.location.href = "forum.html";
                return;
            }

            topicActuel = resultat.body.topic;

            const peutModifier = Number(topicActuel.auteur_id) === Number(utilisateur.id) || utilisateur.role === "admin";

            if (!peutModifier) {
                alert("Tu n'as pas le droit de modifier ce topic");
                window.location.href = "topic.html?id=" + topicId;
                return;
            }

            titreInput.value = topicActuel.titre;
            contenuInput.value = topicActuel.contenu;

            if (topicActuel.tags) {
                tagsInput.value = topicActuel.tags;
            }
        })
        .catch(function() {
            alert("Erreur pendant le chargement du topic");
            window.location.href = "forum.html";
        });
}

formModification.addEventListener("submit", function(e) {
    e.preventDefault();

    const titre = titreInput.value.trim();
    const contenu = contenuInput.value.trim();
    const tagsTexte = tagsInput.value.trim();

    let tags = [];

    if (tagsTexte !== "") {
        tags = tagsTexte.split(",");
    }

    fetch("http://localhost:3000/api/topics/" + topicId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titre: titre,
            contenu: contenu,
            tags: tags,
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
        message.textContent = resultat.body.message;

        if (resultat.status === 200) {
            message.style.color = "#00aaff";

            setTimeout(function() {
                window.location.href = "topic.html?id=" + topicId;
            }, 1000);
        } else {
            message.style.color = "#ff8c00";
        }
    })
    .catch(function() {
        message.textContent = "Erreur avec le serveur";
        message.style.color = "#ff8c00";
    });
});

recupererTopic();