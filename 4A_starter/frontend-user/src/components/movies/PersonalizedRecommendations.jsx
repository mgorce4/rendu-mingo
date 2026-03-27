// PersonalizedRecommendations.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import MovieCarousel from "./MovieCarousel";
import Loading from "../common/Loading";

// Context
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

// Services
import { moviesAPI } from "../../services/api";
import { genreColors } from "../../services/genreColors";

/**
 * Composant pour afficher les recommandations personnalisées
 * Affiche les genres préférés et les films correspondants
 * Utilisé sur la page d'accueil pour les utilisateurs connectés
 */
function PersonalizedRecommendations() {
  const navigate = useNavigate();

  // États locaux
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Context
  const { isAuthenticated, user } = useAuth();
  const { error: showError } = useNotification();

  // Fonction pour charger les recommandations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gestion conditionnelle #1: Vérifier que l'utilisateur est connecté
      if (!isAuthenticated()) {
        setMoviesByGenre({});
        setFavoriteGenres([]);
        setLoading(false);
        return;
      }

      // Gestion conditionnelle #2: Appeler l'API
      const response = await moviesAPI.getByUserFavoriteGenres();

      if (!response?.success) {
        throw new Error(response?.message || "Erreur lors du chargement");
      }

      const { favoriteGenres: genres, moviesByGenre: movies } = response.data;

      // Gestion conditionnelle #3: Assigner les données
      setFavoriteGenres(genres || []);
      setMoviesByGenre(movies || {});
      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      showError(err.message);
      setMoviesByGenre({});
      setFavoriteGenres([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les recommandations au montage et quand l'utilisateur change
  useEffect(() => {
    if (isAuthenticated()) {
      fetchRecommendations();
    } else {
      setLoading(false);
      setMoviesByGenre({});
      setFavoriteGenres([]);
    }
  }, [isAuthenticated(), user?.id]);

  // Pendant le chargement
  if (loading) {
    return <Loading />;
  }

  // Si l'utilisateur n'est pas connecté ou n'a pas de genres favoris
  if (!isAuthenticated() || favoriteGenres.length === 0) {
    return null;
  }

  // Si pas d'erreur mais aucun film trouvé
  if (Object.keys(moviesByGenre).length === 0) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-gray-400 text-sm">
          Aucun film trouvé pour vos genres favoris.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section titre + bouton modifier */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Films par genres préférés</h2>
        
        {/* Bouton pour éditer les genres */}
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 text-sm"
        >
          ✎ Modifier
        </button>
      </div>

      {/* Afficher les films pour chaque genre préféré */}
      {Object.entries(moviesByGenre).map(([genre, movies]) => {
        // Vérifier que les films existent
        if (!movies || movies.length === 0) {
          return null;
        }

        // Obtenir la couleur du genre
        const genreColor = genreColors[genre] || genreColors.default;

        return (
          <div key={genre} className="space-y-3">
            {/* Titre du genre avec couleur */}
            <h3
              className="text-lg font-semibold"
              style={{ color: genreColor?.text || "#d1d5db" }}
            >
              {genre}
            </h3>

            {/* Carrousel des films */}
            <MovieCarousel movies={movies} />
          </div>
        );
      })}
    </div>
  );
}

export default PersonalizedRecommendations;
