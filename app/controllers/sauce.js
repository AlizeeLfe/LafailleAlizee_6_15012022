//************************************LOGIQUE METIER ROUTES "SAUCES"***************************
//Exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de l'application

// Importation du modèle "sauce"
const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");

// Exportation d'une fonction pour ....
//...Récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id,})
    .then((sauce) => {
      sauce.imageUrl = `${req.protocol}://${req.get('host')}` +  sauce.imageUrl
      res.status(200).json(sauce)
    })

    .catch((error) => res.status(404).json({ error }));
};

//...Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      sauces = sauces.map((sauce) => {
        sauce.imageUrl = `${req.protocol}://${req.get('host')}` +  sauce.imageUrl
        return sauce
      })
      res.status(200).json(sauces)
    })
    .catch((error) => res.status(400).json({ error }));
};

//...Créer une sauce
exports.createSauce = (req, res, next) => {
  if (!req.file) {
    return res.status(422).json({
      message: "Your request does not contain an image.",
    });
  }
  // Check if request contain text
  if (!req.body) {
    return res.status(422).json({
      message: "Your request does not contain text.",
    });
  }
  // Analyse de la chaine de caratère et extraction de l'objet Json de "sauce" utilisable
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Pas besoin de Id car "new" de Mongoose va créer par défaut un champ Id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};


