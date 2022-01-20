// Importation de Mongoose
const mongoose = require("mongoose");

// Création d'un schéma de données (informations requises)
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: ["String <userId>"], required: true },
  usersDisliked: { type: ["String <userId>"], required: true },
});

// Exporter le modèle pour pouvoir l'utiliser (lire, enregistrer dans la base de données)
module.exports = mongoose.model("Sauce", sauceSchema);
