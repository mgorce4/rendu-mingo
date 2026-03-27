import express from "express";
import {
  createRental,
  getMyRentals,
  getAllRentals,
  cancelRental,
  getRentalStats,
  getRecommendations,
} from "../controllers/rental.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes protégées utilisateur
router.post("/", protect, createRental);
router.get("/my-rentals", protect, getMyRentals);
router.get("/recommendations", protect, getRecommendations);
router.delete("/:id", protect, cancelRental);

// Routes temporaires (simulation userId)
router.post(
  "/",
  (req, res, next) => {
    req.user = { _id: "507f1f77bcf86cd799439011" }; // User ID de test
    next();
  },
  createRental,
);

router.get(
  "/my-rentals",
  (req, res, next) => {
    req.user = { _id: "507f1f77bcf86cd799439011" };
    next();
  },
  getMyRentals,
);

router.delete(
  "/:id",
  (req, res, next) => {
    req.user = { _id: "507f1f77bcf86cd799439011" };
    next();
  },
  cancelRental,
);

// Routes admin
router.get("/", protect, admin, getAllRentals);
router.get("/stats", protect, admin, getRentalStats);
router.get("/", getAllRentals);
router.get("/stats", getRentalStats);

export default router;
