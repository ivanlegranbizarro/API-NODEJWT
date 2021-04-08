const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
require("dotenv").config();

const app = express();

// Capturar body

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión Base de datos
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://legran:${process.env.PASSWORD}@cluster0.36olv.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((err) => {
    console.log("Error DB:", err);
  });
// Importar routes

const authRoutes = require("./routes/auth");

const validaToken = require("./routes/validate-token");

const admin = require("./routes/admin");

// Routes

app.use("/api/user", authRoutes);
app.use("/api/admin", validaToken, admin);

// Iniciar server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Escuchando en el puerto: ${PORT}`);
});
