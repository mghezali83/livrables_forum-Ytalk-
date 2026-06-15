const mysql = require("mysql2");

const connexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ytalk_forum"
});

connexion.connect(function(erreur) {
    if (erreur) {
        console.log("Erreur connexion base de donnees :", erreur);
        return;
    }

    console.log("Connexion a la base de donnees reussie");
});

module.exports = connexion;