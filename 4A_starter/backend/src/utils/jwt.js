import jwt from "jsonwebtoken";

/**
 * Générer un token JWT
 * @param {string} userId - ID de l'utilisateur
 * @returns {string} Token JWT
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Vérifier et décoder un token JWT
 * @param {string} token - Token à vérifier
 * @returns {object|null} Données décodées ou null si invalide
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
};

/**
 * Décoder un token sans vérification (pour debug)
 * @param {string} token - Token à décoder
 * @returns {object|null} Données décodées
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Extraire le token du header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token ou null
 */
export const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};
