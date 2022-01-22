//****************************ROUTEUR "USER"*******************************

// On a besoin d'Express....
const express = require('express');
//... pour créer un routeur
const router = express.Router();
// Il nous faut le controleur pour associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// Création des 2 routes "post"(méthode signup et login)
// Car le front-end va aussi envoyer des informations (adresse mail et mot de passe)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// On exporte ce routeur
module.exports = router;