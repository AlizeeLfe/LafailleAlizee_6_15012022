// On a besoin d'Express....
const express = require('express');
//... pour créer un routeur
const router = express.Router();
// Importation du router user
const userRoutes = require("./user");

// Enregistrer les routes user (racine de tout ce qui ets lié à l'authentification, passe les routes)
router.use("/api/auth", userRoutes);

module.exports = router