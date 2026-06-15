const listeTopics = document.getElementById("liste-topics");
const rechercheInput = document.getElementById("recherche");
const btnRecherche = document.getElementById("btn-recherche");
const limiteSelect = document.getElementById("limite");

const pagePrecedente = document.getElementById("page-precedente");
const pageSuivante = document.getElementById("page-suivante");
const infoPage = document.getElementById("info-page");

const lienProfile = document.getElementById("lien-profile");
const lienCreation = document.getElementById("lien-creation");
const lienDeconnexion = document.getElementById("lien-deconnexion");

let pageActuelle = 1;
let totalPages = 1;

// on verifie si quelqu'un est connecte
const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

if (!utilisateur) {
    lienProfile.style.display = "none";
    lienCreation.style.display = "none";
    lienDeconnexion.textContent = "Connexion";
    lienDeconnexion.href = "login.html";
} else {
    if (utilisateur.role === "admin") {
        lienProfile.textContent = "Admin";
        lienProfile.href = "admin.html";
    } else {
        lienProfile.textContent = "Profil";
        lienProfile.href = "profile.html";
    }

    lienDeconnexion.addEventListener("click", function(e) {
        e.preventDefault();
        localStorage.removeItem("utilisateur");
        window.location.href = "index.html";
    });
}

// recuperation des topics
function recupererTopics() {
    const recherche = rechercheInput.value.trim();
    const limite = limiteSelect.value;

    fetch("http://localhost:3000/api/topics?recherche=" + encodeURIComponent(recherche) + "&limite=" + limite + "&page=" + pageActuelle)
        .then(function(reponse) {
            return reponse.json();
        })
        .then(function(data) {
            afficherTopics(data.topics);

            totalPages = data.totalPages;

            if (totalPages === 0) {
                totalPages = 1;
            }

            infoPage.textContent = "Page " + pageActuelle + " / " + totalPages;

            pagePrecedente.disabled = pageActuelle <= 1;
            pageSuivante.disabled = pageActuelle >= totalPages;
        })
        .catch(function() {
            listeTopics.innerHTML = "<p>Erreur pendant le chargement des topics.</p>";
        });
}

// afficher les topics dans la page
function afficherTopics(topics) {
    listeTopics.innerHTML = "";

    if (topics.length === 0) {
        listeTopics.innerHTML = "<p>Aucun topic trouvé.</p>";
        return;
    }

    topics.forEach(function(topic) {
        const carte = document.createElement("a");
        carte.classList.add("topic-card");
        carte.href = "topic.html?id=" + topic.id;

        let classeEtat = "etat-ouvert";

        if (topic.etat === "ferme") {
            classeEtat = "etat-ferme";
        }

        let tags = topic.tags;

        if (!tags) {
            tags = "aucun tag";
        }

        carte.innerHTML = `
            <div class="topic-top">
                <div>
                    <h2>${topic.titre}</h2>
                    <p>${couperTexte(topic.contenu, 150)}</p>
                </div>

                <span class="etat ${classeEtat}">${topic.etat}</span>
            </div>

            <div class="topic-infos">
                <span>Auteur : ${topic.auteur}</span>
                <span>Date : ${formaterDate(topic.date_creation)}</span>
                <span class="tags">Tags : ${tags}</span>
            </div>
        `;

        listeTopics.appendChild(carte);
    });
}

// couper le texte si il est trop long
function couperTexte(texte, taille) {
    if (texte.length <= taille) {
        return texte;
    }

    return texte.substring(0, taille) + "...";
}

// format simple de la date
function formaterDate(dateSql) {
    const date = new Date(dateSql);

    return date.toLocaleDateString("fr-FR") + " à " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// boutons
btnRecherche.addEventListener("click", function() {
    pageActuelle = 1;
    recupererTopics();
});

rechercheInput.addEventListener("keyup", function(e) {
    if (e.key === "Enter") {
        pageActuelle = 1;
        recupererTopics();
    }
});

limiteSelect.addEventListener("change", function() {
    pageActuelle = 1;
    recupererTopics();
});

pagePrecedente.addEventListener("click", function() {
    if (pageActuelle > 1) {
        pageActuelle--;
        recupererTopics();
    }
});

pageSuivante.addEventListener("click", function() {
    if (pageActuelle < totalPages) {
        pageActuelle++;
        recupererTopics();
    }
});

// lancement
recupererTopics();