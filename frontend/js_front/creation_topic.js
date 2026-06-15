const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

const formTopic = document.getElementById("form-topic");
const message = document.getElementById("message");
const lienDeconnexion = document.getElementById("lien-deconnexion");

// si pas connecte, retour login
if (!utilisateur) {
    window.location.href = "login.html";
}

// deconnexion
lienDeconnexion.addEventListener("click", function(e) {
    e.preventDefault();

    localStorage.removeItem("utilisateur");
    window.location.href = "index.html";
});

// creation du topic
formTopic.addEventListener("submit", function(e) {
    e.preventDefault();

    const titre = document.getElementById("titre").value.trim();
    const contenu = document.getElementById("contenu").value.trim();
    const tagsTexte = document.getElementById("tags").value.trim();

    let tags = [];

    if (tagsTexte !== "") {
        tags = tagsTexte.split(",");
    }

    fetch("http://localhost:3000/api/topics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titre: titre,
            contenu: contenu,
            tags: tags,
            auteur_id: utilisateur.id
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

        if (resultat.status === 201) {
            message.style.color = "#00aaff";

            setTimeout(function() {
                window.location.href = "topic.html?id=" + resultat.body.topic_id;
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