const express = require("express");
const router = express.Router();

const {
    recupererMessagesTopic,
    envoyerMessage,
    supprimerMessage,
    voterMessage
} = require("../controller/controller_messages");

// recuperer les messages d'un topic
router.get("/topic/:topicId", recupererMessagesTopic);

// envoyer un message dans un topic
router.post("/", envoyerMessage);

// voter sur un message
router.post("/:id/vote", voterMessage);

// supprimer un message
router.delete("/:id", supprimerMessage);

module.exports = router;