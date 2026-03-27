import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Rental from "../models/Rental.js";

dotenv.config();

const testModels = async () => {
  try {
    await connectDB();

    console.log("🧪 Tests des modèles...\n");

    // Test 1: Créer un utilisateur
    console.log("Test 1: Création d'un utilisateur");
    const testUser = await User.create({
      name: "Test User",
      email: "test@test.com",
      password: "test123",
    });
    console.log("✅ Utilisateur créé:", testUser.toJSON());
    console.log("   Avatar auto-généré:", testUser.avatar);

    // Test 2: Tester la méthode comparePassword
    console.log("\nTest 2: Comparaison de mot de passe");
    const userWithPassword = await User.findById(testUser._id).select(
      "+password",
    );
    const isMatch = await userWithPassword.comparePassword("test123");
    console.log("✅ Password match:", isMatch);

    // Test 3: Créer un film
    console.log("\nTest 3: Création d'un film");
    const testMovie = await Movie.create({
      title: "Test Movie",
      description: "Un film de test",
      poster: "https://example.com/poster.jpg",
      backdrop: "https://example.com/backdrop.jpg",
      genre: "Action",
      year: 2024,
      duration: 120,
      price: 4.99,
      rating: 7.5,
    });
    console.log("✅ Film créé:", testMovie.title);
    console.log("   Durée formatée:", testMovie.durationFormatted);

    try {
      await Movie.create({
        title: "Film invalide",
        duration: 600, // Trop long
        price: 3.999, // Trop de décimales
      });
    } catch (error) {
      console.log("✅ Validation échouée comme prévu:", error.message);
    }

    // Test 4: Créer une location
    console.log("\nTest 4: Création d'une location");
    const testRental = await Rental.create({
      user: testUser._id,
      movie: testMovie._id,
      price: testMovie.price,
    });
    console.log("✅ Location créée");
    console.log("   Jours restants:", testRental.daysLeft);
    console.log("   Est active:", testRental.isActive());

    // Test 5: Populate
    console.log("\nTest 5: Populate (relations)");
    const rentalWithDetails = await Rental.findById(testRental._id)
      .populate("user", "name email")
      .populate("movie", "title price");
    console.log("✅ Location avec détails:", {
      user: rentalWithDetails.user.name,
      movie: rentalWithDetails.movie.title,
      price: rentalWithDetails.price,
    });

    // Test 6: Méthodes statiques
    console.log("\nTest 6: Méthodes statiques");
    const activeRentals = await Rental.getActiveRentals(testUser._id);
    console.log("✅ Locations actives:", activeRentals.length);

    // Nettoyage
    console.log("\n🧹 Nettoyage...");
    await User.deleteOne({ _id: testUser._id });
    await Movie.deleteOne({ _id: testMovie._id });
    await Rental.deleteOne({ _id: testRental._id });

    console.log("\n🎉 Tous les tests sont passés!");

    const sciFiMovies = await Movie.getByGenre("Science-Fiction");
    console.log("Films Sci-Fi:", sciFiMovies.length);

    const affordableMovies = await Movie.getByPriceRange(0, 4);
    console.log("Films à moins de 4€:", affordableMovies.length);

    const stats = await Movie.getStatsByGenre();
    console.log("Statistiques par genre:", stats);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

testModels();
