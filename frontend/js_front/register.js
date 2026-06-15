const formRegister = document.getElementById("form-register");
const message = document.getElementById("message");

formRegister.addEventListener("submit", function(e) {
    e.preventDefault();

    const pseudo = document.getElementById("pseudo").value.trim();
    const email = document.getElementById("email").value.trim();
    const motDePasse = document.getElementById("mot_de_passe").value;

    fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pseudo: pseudo,
            email: email,
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

        if (resultat.status === 201) {
            message.style.color = "#00aaff";

            setTimeout(function() {
                window.location.href = "login.html";
            }, 1200);
        } else {
            message.style.color = "#ff8c00";
        }
    })
    .catch(function() {
        message.textContent = "Erreur avec le serveur";
        message.style.color = "#ff8c00";
    });
});