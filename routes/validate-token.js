const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verificar = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verificar;
    next(); // Si el token es válido dejamos que el usuario haga 'next' hacia la ruta protegida
  } catch (error) {
    res.status(400).json({ error: "Token no válido" });
  }
};

module.exports = verifyToken;
