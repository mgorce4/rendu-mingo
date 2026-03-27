import express from "express";
import {
  getAllMovies,
  getMovieById,
  getRecentMovies,
  getPopularMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getSimilarMovies,
  getMoviesByGenre,
  likeMovie,
  unlikeMovie,
  getLikedMoviesByUser,
} from "../controllers/movie.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllMovies);
router.get("/recent", getRecentMovies);
router.get("/popular", getPopularMovies);
router.get("/genre/:genre", getMoviesByGenre);
router.get("/stats", protect, admin, getMovieStats);
router.get("/:id/similar", getSimilarMovies);

// Route pour obtenir un film par ID, ou les films populaires/récents/aléatoires
router.get("/:id", getMovieById);


//Routes protégées pour les like
router.post("/:id/like", protect, likeMovie);
router.post("/:id/unlike", protect, unlikeMovie);

// Routes protégées admin (sera activé séance 9)
router.post("/", protect, admin, createMovie);
router.put("/:id", protect, admin, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);

// Routes temporaires sans authentification (pour tester)
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
