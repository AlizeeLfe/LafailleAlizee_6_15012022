//*********************************ROUTEUR "SAUCE"***********************

// Création d'un routeur avec Express
// Utilisation d'Express
const express = require("express");
// Méthode "express.Router" = créer des routeurs séparés pour chaque route principale de l'application
const router = express.Router();

// Importation du controller sauce
const sauceCtrl = require("../controllers/sauce");
// Importation du controller like
const likeCtrl = require("../controllers/like");
// Importation du Middleware d'authentification
const auth = require("../middleware/auth");
// Importation du Middleware pour gérer les fichiers entrants
const multer = require("../middleware/multer-config");


// Afficher toutes les sauces (Protection des routes en passant le middleware d'authentification avant le contrôleur)
router.get("/", auth, sauceCtrl.readAllSauces);
// Afficher une sauce
router.get("/:id", auth, sauceCtrl.readOneSauce);
// Création d'une sauce (fonction "createSauce" qui est importée et appliquée à la route)
router.post("/", auth, multer, sauceCtrl.createSauce);
// Liker et Disliker la sauce 
router.post("/:id/like", auth, likeCtrl.likeAndDislikeSauce);
// Modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
// Supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// RGPD
// Signaler une sauce
router.post("/:id/report", auth, sauceCtrl.report);



// On réexporte le routeur de ce fichier
module.exports = router;
