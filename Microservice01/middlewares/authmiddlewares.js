const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '7d';

/**
 * Hache le mot de passe présent dans req.body.password (middleware pour route POST /api/users)
 */
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

/**
 * Compare un mot de passe en clair avec un hash
 */
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * Génère un JWT contenant l'id et le rôle (utiliser au login)
 * payload minimal : { id, role }
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Vérifie le JWT envoyé dans l'en-tête Authorization: Bearer <token>
 * Attache l'objet décodé sur req.user
 */
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attendu: { id, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

/**
 * Fabrique un middleware d'autorisation par rôle.
 * Usage: app.get('/admin/users', authenticateJWT, authorizeRoles('ADMIN'), handler)
 */
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

/**
 * Middleware dédié aux routes ADMIN
 */
const adminOnly = authorizeRoles('ADMIN');

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  authenticateJWT,
  authorizeRoles,
  adminOnly,
};
