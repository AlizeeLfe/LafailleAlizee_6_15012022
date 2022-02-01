//******************CONFIGURATION DE MULTER (PACKAGE DE GESTION DE FICHIERS)****************

// Importation de Multer
const multer = require("multer");

// Dictionnaire de type mime avec un objet qui regroupe les 3 différents minetypes que l'on peut récupérer depuis le front-end
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Création d'une constante à passer à Multer comme configuration...
//...qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
// diskStorage() configure le chemin & le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  // Fonction qui indique à Multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    // Null = il n'y a pas eu d'erreur, et nom du dossier
    callback(null, "images");
  }, // Fonction qui indique a Multer quel nom de fichier utiliser
  filename: (req, file, callback) => {
    // Création du nom avec nom d'origine, on retire les espaces pour eviter les erreurs, et relie les éléments du tableau avec des "_"
    const name = file.originalname.split(" ").join("_");
    // Création l'extension du fichier...
    //...qui sera l'élément de notre dictionnaire qui correspond au minetype du fichier envoyé par le front-end
    const extension = MIME_TYPES[file.mimetype];
    // Appel du callback : pas d'erreur + création du filename entier avec name qu'on à créé au dessus...
    //...+ un time stamp (pour le rendre le plus unique possible) + "." + l'extension du fichier
    callback(null, name + Date.now() + "." + extension);
    // -> On a généré un nom de fichier unique pour notre extension
  },
});

// Exportation du Middleware Multer configuré
// Méthode "multer" à laquelle on passe notre objet "storage" et appel la méthode "single" pour dire qu'il s'agit...
//...d'un fichier unique, et on explique à Multer que nous gérerons uniquement les téléchargements de fichiers image
module.exports = multer({ storage: storage }).single("image");
