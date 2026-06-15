const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

const lienProfil = document.getElementById("lien-profil");
const texteProfil = document.getElementById("texte-profil");
const lienInscription = document.getElementById("lien-inscription");

const textePresentation = document.getElementById("texte-presentation");

const boutonPrincipal = document.getElementById("bouton-principal");
const boutonSecondaire = document.getElementById("bouton-secondaire");

const carteProfil = document.getElementById("carte-profil");
const titreCarteProfil = document.getElementById("titre-carte-profil");
const texteCarteProfil = document.getElementById("texte-carte-profil");

// si l'utilisateur est connecte on change l'accueil
if (utilisateur) {
    if (utilisateur.role === "admin") {
        texteProfil.textContent = "Admin";
        lienProfil.href = "admin.html";

        boutonPrincipal.textContent = "Dashboard admin";
        boutonPrincipal.href = "admin.html";

        carteProfil.href = "admin.html";
        titreCarteProfil.textContent = "Administration";
        texteCarteProfil.textContent = "Accède au dashboard pour gérer le forum.";
    } else {
        texteProfil.textContent = "Profil";
        lienProfil.href = "profile.html";

        boutonPrincipal.textContent = "Voir mon profil";
        boutonPrincipal.href = "profile.html";

        carteProfil.href = "profile.html";
        titreCarteProfil.textContent = "Profil";
        texteCarteProfil.textContent = "Retrouve tes topics, ton activité et tes informations.";
    }

    lienInscription.textContent = "Déconnexion";
    lienInscription.href = "#";

    textePresentation.textContent = "Tu es connecté sur Ytalk. Tu peux maintenant consulter les topics, participer aux échanges et discuter avec la communauté.";

    boutonSecondaire.textContent = "Se déconnecter";
    boutonSecondaire.href = "#";

    lienInscription.addEventListener("click", function(e) {
        e.preventDefault();
        deconnecterUtilisateur();
    });

    boutonSecondaire.addEventListener("click", function(e) {
        e.preventDefault();
        deconnecterUtilisateur();
    });
}

// fonction pour se deconnecter
function deconnecterUtilisateur() {
    localStorage.removeItem("utilisateur");
    window.location.href = "index.html";
}