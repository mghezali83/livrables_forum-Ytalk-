const express = require("express");
const router = express.Router();

const { inscrireUtilisateur, connecterUtilisateur } = require("../controller/controller_auth");

router.post("/register", inscrireUtilisateur);
router.post("/login", connecterUtilisateur);

module.exports = router;