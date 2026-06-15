const express = require("express");
const router = express.Router();

const {
    recupererTopics,
    recupererTopicParId,
    creerTopic,
    modifierTopic,
    supprimerTopic
} = require("../controller/controller_topics");

// recuperer les topics avec recherche et pagination
router.get("/", recupererTopics);

// recuperer un topic precis
router.get("/:id", recupererTopicParId);

// creer un topic
router.post("/", creerTopic);

// modifier un topic
router.put("/:id", modifierTopic);

// supprimer un topic
router.delete("/:id", supprimerTopic);

module.exports = router;