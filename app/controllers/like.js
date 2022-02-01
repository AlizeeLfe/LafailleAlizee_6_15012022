// Importation du model sauce
const Sauce = require("../models/sauce");

//...Liker et disliker une sauce
exports.likeAndDislikeSauce = (req, res, next) => {
  // Aller chercher l'objet dans la base de données (méthode findOne)
  //(req.params pour récupérer l'id de la sauce dans la requête et attribuer cette valeur à la key _id)
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Début switch case
      switch (req.body.like) {
        // AJOUTER UN LIKE (like +1)
        case 1:
          // Définir un cas par défaut
          let toChange = {
            // Incrementation de 1 dans le champ "likes"
            $inc: { likes: 1 },
            // Ajouter le userId dans le tableau des "usersLiked"
            $push: { usersLiked: req.body.userId },
          };
          // Si il n'y a pas de like mais un dislike, alors on change le comportement de "to change" pour retirer également le dislike
          if (!sauce.usersLiked.includes(req.body.userId)) {
            if (sauce.usersDisliked.includes(req.body.userId)) {
              toChange = {
                $inc: { dislikes: -1, likes: 1 },
                // Ajouter le userId dans le tableau des "usersLiked" et retirer le userId du tableau des "usersDislikes"
                $pull: { usersDisliked: req.body.userId },
                $push: { usersLiked: req.body.userId },
              };
            }
            // Mise à jour sauce dans la base de données
            Sauce.updateOne(
              // Chercher la sauce dans la base de données
              { _id: req.params.id },
              toChange
            )
              .then(() =>
                res.status(201).json({ message: "User like completed" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        // AJOUTER UN DISLIKE (dislike +1)
        case -1:
          let toChangeDislike = {
            $inc: { dislikes: 1 },
            // Ajouter le userId dans le tableau des usersLiked
            $push: { usersDisliked: req.body.userId },
          };

          if (!sauce.usersDisliked.includes(req.body.userId)) {
            if (sauce.usersLiked.includes(req.body.userId)) {
              toChangeDislike = {
                $inc: { likes: -1, dislikes: 1 },
                // Ajouter le userId dans le tableau des usersLiked
                $push: { usersDisliked: req.body.userId },
                $pull: { usersLiked: req.body.userId },
              };
            }
            // Mise à jour sauce dans la base de données
            Sauce.updateOne(
              // Chercher la sauce dans la base de données
              { _id: req.params.id },
              toChangeDislike
            )
              .then(() =>
                res.status(201).json({ message: "User dislike completed" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case 0:
          // ENLEVER UN LIKE (like et dislike = 0)
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() =>
                res.status(201).json({ message: "Like and dislike removed" })
              )
              .catch((error) => res.status(400).json({ error }));
          }

          // ENLEVER UN DISLIKE (like et dislike = 0)
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() =>
                res.status(201).json({ message: "Like and dislike removed" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
