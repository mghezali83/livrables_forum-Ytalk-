const formLogin = document.getElementById("form-login");
const message = document.getElementById("message");

formLogin.addEventListener("submit", function(e) {
    e.preventDefault();

    const identifiant = document.getElementById("identifiant").value.trim();
    const motDePasse = document.getElementById("mot_de_passe").value;

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            identifiant: identifiant,
            mot_de_passe: motDePasse
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

            // on garde les infos d l'utilisateur connecte
            localStorage.setItem("utilisateur", JSON.stringify(resultat.body.utilisateur));

            setTimeout(function() {
                window.location.href = "index.html";
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