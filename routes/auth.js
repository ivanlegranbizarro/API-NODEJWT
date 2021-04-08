const router = require("express").Router();
const User = require("../models/User");

// Hashear la contraseña

const bcrypt = require("bcrypt");

// Jason Web Token

const jwt = require("jsonwebtoken");

// Validaciones
const Joi = require("@hapi/joi");

const schemaRegister = Joi.object({
  name: Joi.string().min(4).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

// Login

router.post("/login", async (req, res) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ error: true, mensaje: "Credenciales incorrectos" });

  const passValida = await bcrypt.compare(req.body.password, user.password);
  if (!passValida)
    return res
      .status(400)
      .json({ error: true, mensaje: "Credenciales incorrectos" });

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

// Register

router.post("/register", async (req, res) => {
  // Validaciones de usuario

  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const existeElEmail = await User.findOne({ email: req.body.email });

  if (existeElEmail)
    return res
      .status(400)
      .json({ error: true, mensaje: "Email ya registrado" });

  // Hashear contraseña

  const saltos = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, saltos);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  try {
    const userDB = await user.save();
    res.json({
      error: null,
      data: userDB,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
