const express = require("express");
const router = express.Router();

const {
    recupererProfile
} = require("../controller/controller_profile");

// recuperer les infos du profile
router.get("/:id", recupererProfile);

module.exports = router;