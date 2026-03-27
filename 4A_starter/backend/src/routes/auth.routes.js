import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  updateFavoriteGenres,
  getLikedMovies
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);

// Routes protégées
router.get("/me", protect, getMe);
router.get("/me/likes", protect, getLikedMovies);

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/favorite-genres", protect, updateFavoriteGenres);
router.post("/logout", protect, logout);

export default router;
