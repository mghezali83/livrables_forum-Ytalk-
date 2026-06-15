const crypto = require("crypto");
const db = require("../db");

// hashasge en sha_512 du coup 128 caractéres
function hasherMotDePasse(motDePasse) {
    return crypto.createHash("sha512").update(motDePasse).digest("hex");
}

//on verifie que le pseudo a que des chiffre et lettrre 
function pseudoValide(pseudo) {
    const chiflet = /^[a-zA-Z0-9]+$/;
    return chiflet.test(pseudo);
}

// on verifie si dans le mdp fait 8 caracterer et ai au moins 1 majuscule et 1 caractére spécial
function motDePasseValide(motDePasse) {
    const contientMajuscule = /[A-Z]/.test(motDePasse);
    const contientSpecial = /[^a-zA-Z0-9]/.test(motDePasse);

    return motDePasse.length >= 8 && contientMajuscule && contientSpecial;
}

// inscription
function inscrireUtilisateur(req, res) {
    const pseudo = req.body.pseudo;
    const email = req.body.email;
    const motDePasse = req.body.mot_de_passe;
    //verifie si il a bien remplie tout les champs 
    if (!pseudo || !email || !motDePasse) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires"
        });
    }
    // verifie si le pseudo est valie par rapport a la function pseudo valide
    if (!pseudoValide(pseudo)) {
        return res.status(400).json({
            message: "Le pseudo doit contenir seulement des lettres et des chiffres"
        });
    }
    // verifie si le mdp est valide par rapport a la dunction motDePasseValide
    if (!motDePasseValide(motDePasse)) {
        return res.status(400).json({
            message: "Le mot de passe doit faire 8 caracteres minimum, avec une majuscule et un caractere special"
        });
    }

    // on verifie si le pseudo ou l'email existe deja
    const requeteVerif = "SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?";

    db.query(requeteVerif, [pseudo, email], function(erreur, resultats) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur serveur"
            });
        }
        //deja existant
        if (resultats.length > 0) {
            return res.status(400).json({
                message: "Ce pseudo ou cet email existe deja"
            });
        }
        
        const motDePasseHash = hasherMotDePasse(motDePasse);
        
        const requeteAjout = `
            INSERT INTO utilisateurs (pseudo, email, mot_de_passe)
            VALUES (?, ?, ?)
        `;

        db.query(requeteAjout, [pseudo, email, motDePasseHash], function(erreurAjout) {
            if (erreurAjout) {
                return res.status(500).json({
                    message: "Erreur pendant l'inscription"
                });
            }

            res.status(201).json({
                message: "SUCESS"
            });
        });
    });
}

// connexion
function connecterUtilisateur(req, res) {
    const identifiant = req.body.identifiant;
    const motDePasse = req.body.mot_de_passe;

    if (!identifiant || !motDePasse) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires"
        });
    }
    // on hash le mdp pour le comparer avec celui de la DB
    const motDePasseHash = hasherMotDePasse(motDePasse);

    const requete = `
        SELECT id, pseudo, email, role, banni
        FROM utilisateurs
        WHERE (pseudo = ? OR email = ?)
        AND mot_de_passe = ?
    `;

    db.query(requete, [identifiant, identifiant, motDePasseHash], function(erreur, resultats) {
        if (erreur) {
            return res.status(500).json({
                message: "Erreur serveur"
            });
        }
        //mesage erreur si pas bon identifiant ou mdp 
        if (resultats.length === 0) {
            return res.status(401).json({
                message: "Identifiant ou mot de passe incorrect"
            });
        }

        const utilisateur = resultats[0];

        if (utilisateur.banni === 1) {
            return res.status(403).json({
                message: "Ton compte est banni"
            });
        }
        
        res.status(200).json({
            message: "Connexion reussie",
            utilisateur: {
                id: utilisateur.id,
                pseudo: utilisateur.pseudo,
                email: utilisateur.email,
                role: utilisateur.role
            }
        });
    });
}

module.exports = {
    inscrireUtilisateur,
    connecterUtilisateur
};