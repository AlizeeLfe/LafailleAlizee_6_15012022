//************************************LOGIQUE METIER ROUTES "SAUCES"***************************
//Exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de l'application

// Importation du modèle "sauce"
const Sauce = require("../models/sauce");
// Importation du package "file system" de node (Donne accès aux fonctions qui permet de modifier/ supprimer le système de fichiers)
const fs = require("fs");

// Exportation d'une fonction pour ....
//...Récupérer une seule sauce
exports.readOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      sauce.imageUrl = `${req.protocol}://${req.get("host")}` + sauce.imageUrl;
      res.status(200).json(sauce);
    })
    .catch((error) => res.status(404).json({ error }));
};

//...Récupérer toutes les sauces
exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      sauces = sauces.map((sauce) => {
        sauce.imageUrl =
          `${req.protocol}://${req.get("host")}` + sauce.imageUrl;
        return sauce;
      });
      res.status(200).json(sauces);
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
    .then(() => res.status(201).json({ message: "Sauce created !" }))
    .catch((error) => res.status(400).json({ error }));
};

//...Modifier une sauce
exports.updateSauce = (req, res, next) => {
  // 2 cas a prendre en compte :
  // CAS 1 : Est-ce que req.file existe ? (Si on ajoute une nouvelle image on aura un "req.file")
  // Si on trouve un fichier : on récupère la chaine de caractère (toutes les infos sur la sauce), on la parse en objet, et on modifie l'image url (car nouvelle image)
  // CAS 2 : Pas d'image à modifier, on fait une copie du corps de la requête "req.body"
  const sauceObject = req.file
    ? {
        // On récupère la chaine de caractères, on la parse en Object JS
        ...JSON.parse(req.body.sauce),
        // Modification de l'image URL
        imageUrl: `/images/${req.file.filename}`,
      }
    : { ...req.body };
  // On prend la sauce qu'on a créé, et on modifie son identifiant, pour correspondre à l'identifiant des paramètres de requête
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce updated !" }))
    .catch((error) => res.status(400).json({ error }));
};

//...Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // Chercher la sauce
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // si la sauce n'existe pas : erreur
    if (!sauce) {
      res.status(404).json({
        error: new Error("No such sauce"),
      });
    }
    // Vérifier qu'uniquement la personne à qui appartient l'objet puisse le supprimer
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({
        error: new Error("Unauthorized request!"),
      });
    }
    // Extraire le fichier
    // Récupérer l'image url de la base et split avant et apres "/images/" et récupérer le 2ème élément du tableau : le nom du fichier
    const filename = sauce.imageUrl.split("/images/")[1];
    // Fonction du package fs pour supprimer un fichier (unlink)
    fs.unlink(`images/${filename}`, () => {
      // Supprimer la sauce de la base de données
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce removed" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

//...Signaler une sauce (RGPD)
exports.report = (req, res, next) => {
  if (req.body.sauceToReport) {
    Sauce.findOneAndUpdate(
      {
        _id: req.body.sauceToReport,
      },
      {
        $inc: { reports: 1 },
        $push: { usersWhoReport: req.auth.userId },
      }
    )
      .then((sauce) => {
        if (!sauce) {
          return res.status(404).json({
            error: "Sauce not found",
          });
        }
        res.status(200).json({ message: "Sauce reported !" });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(400).json({ message: "userId required" });
  }
};
