// FavoriteGenres.jsx
import { useState, useEffect } from "react";

// Services
import { genresAPI } from "../services/api";
import { genreColors } from "../services/genreColors";

// Context
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Composant pour gérer les genres favoris de l'utilisateur
const FavoriteGenres = () => {
  // États locaux
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const { error, success } = useNotification();

  const { user, updateFavoriteGenres } = useAuth();

  // Charger les genres
  const fetchAllGenres = async () => {
    try {
      const result = await genresAPI.getAll();
      if (!result.success) {
        throw new Error(
          result.message || "Erreur lors du chargement des genres",
        );
      }
      setAllGenres(result.data);
    } catch (err) {
      error(err.message || "Erreur lors du chargement des genres");
    }
  };

  // Charger les genres au montage du composant ou lorsque l'utilisateur change
  useEffect(() => {
    fetchAllGenres();

    if (user) {
      setFavoriteGenres(user.favoriteGenres || []);
    }
  }, [user]);

  // Gérer la sélection/désélection d'un genre
  const handleGenreToggle = (genre) => async () => {
    const isSelected = favoriteGenres.includes(genre);
    const updatedGenres = isSelected
      ? favoriteGenres.filter((g) => g !== genre)
      : [...favoriteGenres, genre];

    try {
      const result = await updateFavoriteGenres(updatedGenres);
      if (!result.success) {
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }
      success("Genres favoris mis à jour avec succès");
    } catch (err) {
      error(err.message || "Erreur lors de la mise à jour des genres favoris");
    }
  };

  return (
    <div className="mt-12 bg-gray-900 rounded-lg border border-gray-800 p-8">
      <h2 className="text-2xl font-bold mb-6">Genres favoris</h2>
      <p className="text-gray-400 mb-4">
        Gérez vos genres de films préférés pour des recommandations
        personnalisées.
      </p>
      {/* Composant de sélection de genres  */}
      <div className="flex flex-wrap gap-4">
        {allGenres.map((genre) => (
          <button
            key={genre}
            className={`px-4 py-2 rounded-full border ${favoriteGenres.includes(genre) ? `${genreColors[genre] || "bg-red-500"} text-white` : "bg-gray-800 text-gray-400 border-gray-700"}`}
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
