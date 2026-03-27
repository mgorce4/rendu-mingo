import express from "express";
import { getAllGenres } from "../controllers/genre.controller.js";

const router = express.Router();

// GET /api/genres
router.get("/", getAllGenres);

export default router;
