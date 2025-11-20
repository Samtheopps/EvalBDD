const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '7d';


async function hashPassword(req, res, next) {
  try {
    if (req.body && req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      req.body.password = hashed;
    }
    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
  }
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}


function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}


function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}


function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Droits insuffisants' });
    }
    return next();
  };
}


module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  authenticateJWT,
  authorizeRoles,
};
