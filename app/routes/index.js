// On a besoin d'Express....
const express = require('express');
//... pour créer un routeur
const router = express.Router();
// Importation du router user
const userRoutes = require("./user");
// Importation du router sauce
const sauceRoutes = require("./sauce");

// Enregistrer les routes user (racine de tout ce qui ets lié à l'authentification, passe les routes)
router.use("/api/auth", userRoutes);
// La logique CRUD de sauce.js est importée et appliquée à la même route
// = enregistrer notre routeur pour toutes les demandes effectuées vers /api/sauce
// = (enregistrer le routeur dans l'application)
router.use("/api/sauce", sauceRoutes);

// On réexporte le routeur de ce fichier
module.exports = router;