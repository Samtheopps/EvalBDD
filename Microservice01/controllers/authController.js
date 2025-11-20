const User = require('../models/user');
const { comparePassword, signToken } = require('../middlewares/authmiddlewares');


async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    // si dans le modèle password a `select: false`, on doit explicitement le demander
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = signToken({ id: user._id, role: user.role });

    const userObj = user.toObject();
    delete userObj.password; // ne renvoie pas le hash

    return res.json({ success: true, token, user: userObj });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
}

async function me(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
}

module.exports = { login, me };

