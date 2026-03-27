// MoviesByFavoriteGenres.jsx
import { useState, useEffect } from "react";

// Components
import MovieCarousel from "./MovieCarousel";
import Loading from "../common/Loading";
import LoadingError from "../common/LoadingError";

// Context
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

// Services
import { moviesAPI } from "../../services/api";
import { genreColors } from "../../services/genreColors";

/**
 * Composant pour afficher les films groupés par genres préférés
 * Utilisé sur la page dédiée /personalized
 */
function MoviesByFavoriteGenres() {
  // États locaux
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Context
  const { isAuthenticated, user } = useAuth();
  const { error: showError } = useNotification();

  // Fonction pour charger les films
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gestion conditionnelle #1: Vérifier que l'utilisateur est connecté
      if (!isAuthenticated() || !user) {
        setError("Vous devez être connecté pour voir vos recommandations");
        setMoviesByGenre({});
        setFavoriteGenres([]);
        return;
      }

      // Gestion conditionnelle #2: Appeler l'API
      const response = await moviesAPI.getByUserFavoriteGenres();

      // Gestion conditionnelle #3: Vérifier la réponse de l'API
      if (!response?.success) {
        throw new Error(response?.message || "Erreur lors du chargement");
      }

      const { favoriteGenres: genres, moviesByGenre: movies } = response.data;

      // Gestion conditionnelle #4: Vérifier si l'utilisateur a des genres préférés
      if (!genres || genres.length === 0) {
        setError("Veuillez d'abord sélectionner vos genres préférés");
        setFavoriteGenres([]);
        setMoviesByGenre({});
        return;
      }

      // Gestion conditionnelle #5: Assigner les données
      setFavoriteGenres(genres);
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

  // Charger les films au montage et quand l'utilisateur change
  useEffect(() => {
    fetchMovies();
  }, [isAuthenticated(), user?.id]);

  // État de chargement
  if (loading) {
    return <Loading />;
  }

  // État d'erreur avec authentification
  if (error && !isAuthenticated()) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl font-bold text-red-500 mb-2">Authentification requise</h3>
        <p className="text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  // État d'erreur (genres non sélectionnés)
  if (error && isAuthenticated()) {
    return (
      <LoadingError message={error} onRetry={fetchMovies} />
    );
  }

  // État vide (aucun film trouvé)
  if (Object.keys(moviesByGenre).length === 0 || favoriteGenres.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400 text-lg">
          Aucun film trouvé pour vos genres de films préférés.
        </p>
      </div>
    );
  }

  // Rendu normal - afficher les films par genre
  return (
    <div className="space-y-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Vos films par genres</h2>
        <p className="text-gray-400">
          Découvrez les meilleurs films dans vos genres préférés
        </p>
      </div>

      {Object.entries(moviesByGenre).map(([genre, movies]) => {
        // Vérifier que les films existent
        if (!movies || movies.length === 0) {
          return null;
        }

        // Obtenir la couleur du genre avec fallback sécurisé
        const genreColor = genreColors[genre] || genreColors.default;

        return (
          <div key={genre} className="space-y-4">
            {/* Titre du genre avec couleur */}
            <h3
              className="text-2xl font-bold"
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

export default MoviesByFavoriteGenres;
