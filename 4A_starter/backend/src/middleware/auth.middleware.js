import User from '../models/User.js';
import { verifyToken, extractToken } from '../utils/jwt.js';

/**
 * Middleware pour protéger les routes (utilisateur connecté)
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = extractToken(req.headers.authorization);
    }

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Token manquant.'
      });
    }

    // Vérifier le token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur n\'existe plus'
      });
    }

    // Vérifier que le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Non autorisé'
    });
  }
};

/**
 * Middleware pour les routes admin uniquement
 */
export const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé. Authentification requise.'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Droits administrateur requis.'
      });
    }

    next();

  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé'
    });
  }
};

/**
 * Middleware optionnel pour les routes qui peuvent être publiques ou privées
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = extractToken(req.headers.authorization);
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }

    next();

  } catch (error) {
    next();
  }
};
