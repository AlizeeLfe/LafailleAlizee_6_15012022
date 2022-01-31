// Importation du model sauce
const Sauce = require("../models/sauce");

//...Liker et disliker une sauce
exports.likeAndDislikeSauce = (req, res, next) => {
  // Aller chercher l'objet dans la base de données (méthode findOne)
  //(req.params pour récupérer l'id de la sauce dans la requête et attribuer cette valeur à la key _id)
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Switch case
      switch (req.body.like) {
        // AJOUTER UN LIKE (like +1)
        case 1:
          if (
            !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)
          ) {
            // Mise à jour sauce dans la base de données
            Sauce.updateOne(
              // Chercher la sauce dans la base de données
              { _id: req.params.id },
              {
                // Incrementation 1 dans le champ likes
                $inc: { likes: 1 },
                // Ajouter le userId dans le tableau des usersLiked
                $push: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce like +1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        // AJOUTER UN DISLIKE (dislike +1)
        case -1:
          if (
            !sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)
          ) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case 0:
          // ENLEVER UN LIKE (like = 0 en rappuyant sur le like)
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce like 0" }))
              .catch((error) => res.status(400).json({ error }));
          }
          // ENLEVER UN DISLIKE (dislike = 0 en rappuyant sur le dislike)
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "Sauce dislike 0" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
