// Importation du model sauce
const sauce = require("../models/sauce");

//...Liker et disliker une sauce
exports.likeAndDislikeSauce = (req, res, next) => {
  // Affichage du req.body
  console.log("Contenu req.body ctrl like");
  console.log(req.body.like);

  // Récupérer l'iD dans l'url de la requête
  console.log(req.params);

  // Mise au format de l'id pour pouvoir aller chercher l'objet corrspondant dans la base de données
  console.log({ _id: req.params.id });

  // Aller chercher l'objet dans la base de sonnées
  sauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      // Like = 1 (like = +1)
      // utilisation includes(), opérateur $inc, $push, $pull (mongodb)

      switch (req.body.like) {
        case 1:
          // Si le userliked est fasle et si like ==== 1
          if (
            !sauce.usersLiked.includes(req.body.userId) &&
            req.body.like === 1
          ) {
            console.log(
              "userid n'est pas dans userliked bdd et requete front like a 1"
            );
            // mise à jour objet bdd
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: 1 },
                  $push: { usersLiked: req.body.userId },
                }
              )
              .then(() => res.status(201).json({ message: "sauce like + 1" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case -1:
          // Like = -1 (dislike = +1)
          if (
            !sauce.usersDisliked.includes(req.body.userId) &&
            req.body.like === -1
          ) {
            console.log("userId est dans userDisliked bdd et dislikes a 1");
            // mise à jour objet bdd
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: 1 },
                  $push: { usersDisliked: req.body.userId },
                }
              )
              .then(() =>
                res.status(201).json({ message: "sauce dislike + 1" })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;

        case 0:
          // Like = 0 (like = 0)
          if (sauce.usersLiked.includes(req.body.userId)) {
            console.log("userid est pas dans userliked bdd et case = 0");
            // mise à jour objet bdd
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: req.body.userId },
                }
              )
              .then(() => res.status(201).json({ message: "sauce like 0" }))
              .catch((error) => res.status(400).json({ error }));
          }

          // Après un like = -1 on met un Like = 0
          if (sauce.usersDisliked.includes(req.body.userId)) {
            console.log("userId est dans userDisliked bdd et likes = 0");
            // mise à jour objet bdd
            sauce
              .updateOne(
                { _id: req.params.id },
                {
                  $inc: { dislikes: -1 },
                  $pull: { usersDisliked: req.body.userId },
                }
              )
              .then(() => res.status(201).json({ message: "sauce dislike 0" }))
              .catch((error) => res.status(400).json({ error }))
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
