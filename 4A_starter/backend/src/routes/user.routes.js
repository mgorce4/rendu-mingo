import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { updateUserFavoriteGenres } from "../controllers/user.controller.js";

const router = express.Router();

// PUT /api/users/:id
router.put("/:id", protect, updateUserFavoriteGenres);

export default router;
