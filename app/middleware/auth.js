// Importation du package jwt pour vérifier les Token
const jwt = require("jsonwebtoken");

// Export d'un middleware (fonction qui prend en paramètre : la requête la réponse et la fonction "next")
// -> il va être appliqué avant les controleurs de notre route pour que les requêtes soient faites sure des routes protégées.
module.exports = (req, res, next) => {
  // De nombreux problèmes survenir donc on insère tout dans le bloc try..catch
  try {
    // Extraction du token du header "authorization" de la requête entrante, on split le tableau et on récupère le deuxième élément
    const token = req.headers.authorization.split(" ")[1];
    // Décoder le Token avec la fonction "verify" de jwt
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Récupérer l'objet Js du décodage. Ici extraction de l'ID utilisateur de notre token
    const userId = decodedToken.userId;

    // SECURITÉ : Attribuer le userId a l'objet requête (ajout d'un objet auth à l'obj requête) {userId: userId}
    req.auth = { userId };

    // si la demande contient un ID utilisateur, nous le comparons à celui extrait du token.
    // = si on a un userId dans le corps de la requête et si celui-ci est différent du userId
    // = si le corps de la requête comporte un objet à vendre, on vérifie si le userid correspond à celui de l'objet
    if (req.body.userId && req.body.userId !== userId) {
      // On ne veut pas authentifier la requête = renvoyer l'erreur
      throw "Invalid user ID";
      // Sinon (si tout est ok), notre utilisateur est authentifié.
      // On va appeler "next" pour passer au prochain middleware
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
