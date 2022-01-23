const express = require("express");
const cors = require("cors");
const routes = require("./app/routes");

// Init .env config
require("dotenv").config();

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:8081",
};

// Cors supplémentaires utiles ?
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route (ENCORE UTILE ?)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to piquante application" });
});

// Enregistrer le routeur dans l'application ?
app.use(routes);
// Enregistrer les routes user (racine de tout ce qui ets lié à l'authentification, passe les routes)
app.use("/api/auth", userRoutes);

const db = require("./config/db.config");

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
