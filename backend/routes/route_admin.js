const express = require("express");
const router = express.Router();

const {
    recupererUtilisateursAdmin,
    changerBanUtilisateur,
    recupererTopicsAdmin,
    changerEtatTopic,
    supprimerTopicAdmin,
    recupererMessagesAdmin,
    supprimerMessageAdmin
} = require("../controller/controller_admin");

// utilisateurs
router.get("/utilisateurs", recupererUtilisateursAdmin);
router.put("/utilisateurs/:id/ban", changerBanUtilisateur);

// topics
router.get("/topics", recupererTopicsAdmin);
router.put("/topics/:id/etat", changerEtatTopic);
router.delete("/topics/:id", supprimerTopicAdmin);

// messages
router.get("/messages", recupererMessagesAdmin);
router.delete("/messages/:id", supprimerMessageAdmin);

module.exports = router;