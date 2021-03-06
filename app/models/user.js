// Importation de Mongoose
const mongoose = require("mongoose");
const Email = require("mongoose-type-email");
const mongooseEmail = require("mongoose-type-email");

// Rajout d'un validateur comme plugin à notre schéma  (mongoose unique validator)
//(pour pas avoir plusieurs utilisateurs avec la même adresse mail)
// car "unique=true" inssufisant (possibles erreurs de Mongodb).
const uniqueValidator = require("mongoose-unique-validator");

// Création d'un schéma d'utilisateur
const userSchema = mongoose.Schema({
  email: { type: Email, required: true, unique: [true, "email must be unique"] },
  password: { type: String, required: true },
  reports: { type: Number, default: 0},
  usersWhoReport: { type: [String]}
});

// On applique le validator au schéma avant d'en faire un modèle (méthode plugin)
userSchema.plugin(uniqueValidator);

// Exporter le schéma sous forme de modèle
// nom du modèle = user et userschéma comme schéma de données
module.exports = mongoose.model("User", userSchema);
