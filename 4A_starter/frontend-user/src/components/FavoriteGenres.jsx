// FavoriteGenres.jsx
import { useState, useEffect, useCallback } from "react";

// Services
import { genresAPI } from "../services/api";
import { genreColors } from "../services/genreColors";

// Context
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const DEFAULT_GENRES = [
  "Action",
  "Aventure",
  "Drame",
  "Fantastique",
  "Science-Fiction",
  "Thriller",
];

// Composant pour gérer les genres favoris de l'utilisateur
const FavoriteGenres = () => {
  // États locaux
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const { error, success } = useNotification();

  const { user, updateFavoriteGenres } = useAuth();

  // Charger les genres
  const fetchAllGenres = useCallback(async () => {
    try {
      const result = await genresAPI.getAll();
      if (!result.success) {
        throw new Error(
          result.message || "Erreur lors du chargement des genres",
        );
      }
      setAllGenres(result.data);
    } catch {
      // Fallback local pour garder la maquette utilisable même si l'API n'est pas prête
      setAllGenres(
        user?.favoriteGenres?.length ? user.favoriteGenres : DEFAULT_GENRES,
      );
    }
  }, [user]);

  // Charger les genres au montage du composant ou lorsque l'utilisateur change
  useEffect(() => {
    fetchAllGenres();

    if (user) {
      setFavoriteGenres(user.favoriteGenres || []);
    }
  }, [fetchAllGenres, user]);

  // Gérer la sélection/désélection d'un genre
  const handleGenreToggle = (genre) => async () => {
    const isSelected = favoriteGenres.includes(genre);
    const updatedGenres = isSelected
      ? favoriteGenres.filter((g) => g !== genre)
      : [...favoriteGenres, genre];

    try {
      if (typeof updateFavoriteGenres !== "function") {
        setFavoriteGenres(updatedGenres);
        return;
      }

      const result = await updateFavoriteGenres(updatedGenres);
      if (!result?.success) {
        throw new Error(result?.error || "Erreur lors de la mise à jour");
      }
      setFavoriteGenres(updatedGenres);
      success("Genres favoris mis à jour avec succès");
    } catch (err) {
      error(err.message || "Erreur lors de la mise à jour des genres favoris");
    }
  };

  const genresToDisplay =
    allGenres.length > 0
      ? allGenres
      : user?.favoriteGenres?.length
        ? user.favoriteGenres
        : DEFAULT_GENRES;

  return (
    <div className="mt-6 bg-gray-900/70 rounded-lg border border-gray-800 p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-2">Genres favoris</h2>
      <p className="text-xs md:text-sm text-gray-400 mb-4">
        Gérez vos genres de films préférés pour des recommandations
        personnalisées.
      </p>
      {/* Composant de sélection de genres  */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {genresToDisplay.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`px-3 py-1.5 rounded-full border text-xs md:text-sm text-white transition ${genreColors[genre] || "bg-red-500"} ${
              favoriteGenres.includes(genre)
                ? "border-transparent shadow-md"
                : "border-white/40 hover:brightness-110"
            }`}
            onClick={handleGenreToggle(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoriteGenres;
