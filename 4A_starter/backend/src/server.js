import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import mongoose from "mongoose";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connecter à MongoDB
connectDB();

// Middlewares globaux
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple pour le développement
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes de test
app.get("/", (req, res) => {
  res.json({
    message: "Netflix API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      movies: "/api/movies",
      auth: "/api/auth",
      rentals: "/api/rentals",
      reviews: "/api/reviews",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API Netflix is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// TODO: Importer et utiliser les routes (séance 6)
import movieRoutes from "./routes/movie.routes.js";
app.use("/api/movies", movieRoutes);
import authRoutes from "./routes/auth.routes.js";
app.use("/api/auth", authRoutes);
import rentalRoutes from "./routes/rental.routes.js";
app.use("/api/rentals", rentalRoutes);



// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: messages,
    });
  }

  // Erreur de cast Mongoose (ID invalide)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID invalide",
    });
  }

  // Erreur de duplication (email déjà utilisé)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} déjà utilisé`,
    });
  }

  // Erreur par défaut
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

// Gestion des erreurs non gérées
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

export default app;
