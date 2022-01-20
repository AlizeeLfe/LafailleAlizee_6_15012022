//**************IMPLEMENTATION DES ROUTES CRUD DE L'API DANS L'APPLICATION EXPRESS*************
//*******************GESTION DE TOUTES LES REQUÊTES ENVOYEES AU SERVEUR ***********************

const mongoose = require('mongoose');

// Logique pour se connecter à Mongodb
mongoose.connect('mongodb+srv://alizee_2022:xN6s2lte0uiNqQy6@cluster0.udm6g.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
