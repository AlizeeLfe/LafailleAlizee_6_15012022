// Importation de Mongoose
const mongoose = require("mongoose");

// Création d'un schéma de données (informations requises)
const sauceSchema = mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  name: { type: String, trim: true, minlength: 2, maxlength: 20, required: true },
  manufacturer: { type: String, lowercase: true, trim: true, minlength: 2, required: true },
  description: { type: String, lowercase: true, trim: true, minlength: 2, required: true },
  mainPepper: { type: String, lowercase: true, trim: true, minlength: 2, maxlength: 20, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, defaut: 0},
  dislikes: { type: Number, defaut: 0},
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]}
});

// Exporter le modèle pour pouvoir l'utiliser (lire, enregistrer dans la base de données)
module.exports = mongoose.model("Sauce", sauceSchema);
