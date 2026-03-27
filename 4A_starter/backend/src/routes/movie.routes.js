import express from "express";
import {
  getAllMovies,
  getMovieById,
  getRecentMovies,
  getPopularMovies,
  getRandomMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getSimilarMovies,
  getMoviesByGenre,
  getMovieSections,
  getMoviesByUserFavoriteGenres,
  likeMovie,
  unlikeMovie,
  //getLikedMoviesByUser,
} from "../controllers/movie.controller.js";
import { protect, admin, optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route protégée pour les films par genres préférés (spécifique, avant /:id)
router.get("/favorites/by-genre", protect, getMoviesByUserFavoriteGenres);

// Routes publiques
router.get("/", getAllMovies);
router.get("/recent", getRecentMovies);
router.get("/popular", getPopularMovies);
router.get("/random", getRandomMovies);
router.get("/genre/:genre", getMoviesByGenre);
router.get("/sections", optionalAuth, getMovieSections);
router.get("/stats", protect, admin, getMovieStats);
router.get("/:id/similar", getSimilarMovies);

// Route pour obtenir un film par ID, ou les films populaires/récents/aléatoires
router.get("/:id", getMovieById);


//Routes protégées pour les like
//router.post("/:id/like", protect, likeMovie);
//router.post("/:id/unlike", protect, unlikeMovie);

// Routes protégées admin
router.post("/", protect, admin, createMovie);
router.put("/:id", protect, admin, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);

export default router;
