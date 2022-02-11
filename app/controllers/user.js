//********************************LOGIQUE METIER ROUTE "USER"***********************************

// Importation du package de cryptage (bcrypt) pour les mots de passe
const bcrypt = require("bcrypt");
// Importation de notre modèle user (on va enregistrer et lire des user dans ces middleware)
const User = require("../models/user");
const jwt = require("jsonwebtoken");
// Importation node js file system
const fs = require("fs");

//LOGIQUE SIGNUP = CREATION DE NOUVEAUX UTILISATEURS//
// Utilisation de middleware pour la création de nouveaux utilisateurs dans la base de données
// à partir de la connection de l'insciption depuis l'application front-end (avec fonction signup)
exports.signup = (req, res, next) => {
  // Fonction de hachage de bcrypt asynchrone qui renvoie une Promise
  // On lui passe : le mdp du corps de la requête qui sera passée par le front-end,
  // & combien de fois on exécute l'algorythme de hashage (10 tours)
  bcrypt
    .hash(req.body.password, 10)
    // On va créer un nouvel utilisateur avec notre modèle Mongoose
    .then((hash) => {
      const user = new User({
        // mail = celui qui est frouni dans le corps de la reqête
        email: req.body.email,
        // mdp = hash qui a été généré au .then
        password: hash,
      });
      // On l'enregistre dans la base de données
      user
        .save()
        // Renvoyer "201" pour création de ressource + message
        .then(() => res.status(201).json({ message: "User created !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    // On capte l'erreur : 500 = erreur serveur
    .catch((error) => res.status(500).json({ error }));
};

//LOGIQUE LOGIN = PERMETTRE AUX UTILISATEURS EXISTANTS DE SE CONNECTER//
// Utilisation de middleware pour connecter des utilisateurs existants avec la fonction login
exports.login = (req, res, next) => {
  // Vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
  // -> Trouver un seul utilisateur de la base de donnée avec la méthode "findOne"+ objet de comparaison (objet filtre)
  // {utilisateur pour qui, l'adresse mail correspond à l'adresse mail envoyée dans la requête}
  // = On récupère l'utilisateur de la base qui correspond à l'adresse mail entrée
  User.findOne({ email: req.body.email })
    // On vérifie si on à récupéré un user ou non
    .then((user) => {
      // Si le mail n'est pas bon, si on ne reçoit pas de user : renvoie une errer 401 = non autorisé
      if (!user) {
        return res.status(401).json({ error: "User not found !" });
      }
      // Utilisation de la fonction "compare" (asynchrone) du package bcrypt
      // -> on compare le mdp qui est entré (string envoyé avec la requête), ET, le hash qui est enregistré dans la base de donnée
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si la comparaison est pas ok (l'utilisateur a envoyé le mauvais mdp = si on reçoit booleen false)
          if (!valid) {
            return res.status(401).json({ error: "Incorrect password !" });
          }
          // Si mdp ok (true), on revoie une réponse 200 contenant l'ID utilisateur (base) et un token
          res.status(200).json({
            userId: user._id,
            // La méthode sign() du package jwt est une fonction qui utilise une clé secrète pour encoder un token...
            // ... qui peut contenir un payload personnalisé et avoir une validité limitée.
            token: jwt.sign(
              // 1er argument : les données qu'on veut encoder à l'interieur de ce token (payload)
              // creation d'un objet avec un user id pour être sûr que cette requête coresspond à ce user id
              // On encode userid pour la création de nouveaux objets : si creation avec 1 utilisateur ...
              //...on ne peut pas modifier avec 1 autre utilisateur
              { userId: user._id },
              // 2ème argument : chaîne secrète de développement temporaire pour encoder notre token
              // (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
              "RANDOM_TOKEN_SECRET",
              // 3ème argument : de configuration. Application d'une expiration pour le Token
              { expiresIn: "24h" }
            ),
          });
          // En renvoie le Token avec un réponse, la connection sera validée
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Lire ses données personnelles (RGPD)
exports.read = (req, res, next) => {
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      user.usersWhoReport = undefined;
      res.status(200).json(user);
    })
    .catch((error) => res.status(404).json({ error }));
};

// Exporter ses données personnelles (RGPD)
exports.export = (req, res, next) => {
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      user.usersWhoReport = undefined;
      const data = user.toString();
      res.attachment("data.txt");
      res.type("txt");
      res.status(200).json(data);
    })
    .catch((error) => res.status(404).json({ error }));
};

// A VERIFIER //
// Modifier son compte personnel (RGPD)
exports.updateUser = (req, res, next) => {
  // Chercher l'utilisateur
  User.findOne({ _id: req.auth.userId }).then((user) => {
    // s'il n'existe pas : erreur
    if (!user) {
      res.status(404).json({
        error: new Error("User not found"),
      });
    }
    // Vérifier qu'uniquement la personne à qui appartient le compte puisse le modifier
    if (user._id !== req.auth.userId) {
      res.status(401).json({
        error: new Error("Unauthorized request!"),
      });
    }
    // Modifier le compte
    User.updateOne()
    .then(() => res.status(200).json({ message: "User updated !" }))
    .catch((error) => res.status(400).json({ error }));
  });
};

// Supprimer son compte personnel (RGPD)
exports.deleteUser = (req, res, next) => {
  // Chercher l'utilisateur
  User.findOne({ _id: req.auth.userId }).then((user) => {
    // s'il n'existe pas : erreur
    if (!user) {
      res.status(404).json({
        error: new Error("User not found"),
      });
    }
    // Vérifier qu'uniquement la personne à qui appartient le compte puisse le supprimer
    if (user._id !== req.auth.userId) {
      res.status(401).json({
        error: new Error("Unauthorized request!"),
      });
    }
    // Supprimer le compte de la base de données
    User.deleteOne({ _id: req.auth.userId })
      .then(() => res.status(200).json({ message: "User deleted" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

// Signaler un utilisateur (RGPD)
exports.report = (req, res, next) => {
  User.findOne({ _id: req.auth.userId }).then((user) => {
    if (!user) {
      res.status(404).json({
        error: new Error("User not found"),
      });
    }
    let reportUser = {
      $inc: { reports: 1 },
      $push: { usersWhoReport: req.body.userId },
    };

    User.updateOne({ _id: req.params.id }, reportUser)
      .then(() => res.status(201).json({ message: "User has been reported" }))
      .catch((error) => res.status(400).json({ error }));
  });
};
