const express = require("express");
const cors = require("cors");
const routes = require("./app/routes");
// Accéder au path de notre serveur (pour pouvoir avoir accès au chemin de notre système de fichier)
const path = require('path');

// Init .env config
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:8081",
};


app.use(cors(corsOptions));

// Ce middleware intercepte toutes les requêtes qui contiennent du Json
// et nous met à disposition ce contenu (corps de la requête) sur l'objet requête dans req.body
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to piquante application" });
});


// Création d'un Middleware pour dire à Express de servir le dossier statique "images" pour les requêtes /images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Enregistrer le routeur dans l'application 
app.use(routes);

// Why must be here ?
const db = require("./config/db.config");

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
