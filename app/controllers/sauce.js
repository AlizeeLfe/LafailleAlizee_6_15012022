//************************************LOGIQUE METIER ROUTES "SAUCES"***************************
//Exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de l'application

// Importation du modèle "sauce"
const sauce = require("../models/sauce");

// ... récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// ... récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
