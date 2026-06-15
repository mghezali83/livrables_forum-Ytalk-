const express = require("express");
const cors = require("cors");

const routeAuth = require("./routes/route_auth");
const routeTopics = require("./routes/route_topics");
const routeMessages = require("./routes/route_messages");
const routeAdmin = require("./routes/route_admin");
const routeProfile = require("./routes/route_profile");

const app = express();
const port = 3000;

// permet au frontend de parler avec le backend
app.use(cors());

// permet de recevoir les donnees en JSON
app.use(express.json());

// route test simple
app.get("/", function(req, res) {
    res.send("Serveur Ytalk lance");
});

// routes
app.use("/api/auth", routeAuth);
app.use("/api/topics", routeTopics);
app.use("/api/messages", routeMessages);
app.use("/api/admin", routeAdmin);
app.use("/api/profile", routeProfile);

// lancement du serveur
app.listen(port, function() {
    console.log("Serveur lance sur http://localhost:" + port);
});