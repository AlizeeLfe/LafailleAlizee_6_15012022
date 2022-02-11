//****************************ROUTEUR "USER"*******************************

// On a besoin d'Express....
const express = require('express');
//... pour créer un routeur
const router = express.Router();
// Il nous faut le controleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');
// Importation du Middleware d'authentification
const auth = require("../middleware/auth");

// Création des 2 routes "post"(méthode signup et login)
// Car le front-end va aussi envoyer des informations (adresse mail et mot de passe)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// RGPD
// Afficher les données personnelles dans l’interface utilisateur	
router.get("/read", auth, userCtrl.read);
// Exporter les données personnelles
router.get("/export", auth, userCtrl.export);
// Modifier des informations personnelles
router.put("/", auth, userCtrl.updateUser);
// Signaler un utilisateur
router.post("/report", auth, userCtrl.report);
// Supprimer un compte utilisateur
router.delete("/", auth, userCtrl.deleteUser);




// On exporte ce routeur
module.exports = router;