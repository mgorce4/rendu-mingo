// Home.jsx
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import MovieCarousel from "../components/movies/MovieCarousel";
import MovieHeroCarousel from "../components/movies/MovieHeroCarousel";
import Loading from "../components/common/Loading";
import PersonalizedRecommendations from "../components/movies/PersonalizedRecommendations";

// Context
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Services
import { moviesAPI } from "../services/api";

// Page d'accueil
function Home() {
  // États locaux
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [personalizedMovies, setPersonalizedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();
  const { error } = useNotification();
  const authenticated = isAuthenticated();

  // Fonction pour charger les films
  const fetchMovies = async () => {
    try {
      setLoading(true);

      // Endpoint principal pour la maquette home en sections
      const sectionsResponse = await moviesAPI.getSections();
      const sections = sectionsResponse?.data || {};

      const popular = Array.isArray(sections.popular) ? sections.popular : [];
      const recent = Array.isArray(sections.recent) ? sections.recent : [];
      const personalized = Array.isArray(sections.personalized)
        ? sections.personalized
        : [];

      setPopularMovies(popular);
      setRecentMovies(recent);
      setPersonalizedMovies(personalized);

      // Base de recherche/navbar + hero fallback
      const mergedMovies = [...popular, ...recent, ...personalized];
      const uniqueMovies = Array.from(
        new Map(mergedMovies.map((movie) => [movie._id, movie])).values(),
      );

      if (uniqueMovies.length > 0) {
        setMovies(uniqueMovies);
      } else {
        // Fallback si sections vides
        const allMoviesResponse = await moviesAPI.getAll();
        const allMovies = Array.isArray(allMoviesResponse?.movies)
          ? allMoviesResponse.movies
          : Array.isArray(allMoviesResponse?.data)
            ? allMoviesResponse.data
            : [];
        setMovies(allMovies);
      }
    } catch (err) {
      // Fallback total sur les endpoints séparés
      try {
        const [popularResponse, recentResponse, allResponse] = await Promise.all([
          moviesAPI.getPopular(),
          moviesAPI.getRecent(),
          moviesAPI.getAll(),
        ]);

        const popular = Array.isArray(popularResponse?.data)
          ? popularResponse.data
          : Array.isArray(popularResponse)
            ? popularResponse
            : [];
        const recent = Array.isArray(recentResponse?.data)
          ? recentResponse.data
          : Array.isArray(recentResponse)
            ? recentResponse
            : [];
        const allMovies = Array.isArray(allResponse?.movies)
          ? allResponse.movies
          : Array.isArray(allResponse?.data)
            ? allResponse.data
            : [];

        setPopularMovies(popular);
        setRecentMovies(recent);
        setMovies(allMovies.length > 0 ? allMovies : [...popular, ...recent]);
      } catch {
        error(err.message || "Erreur lors du chargement");
      }
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les films
  useEffect(() => {
    fetchMovies();
  }, [authenticated, user]);

  // État de chargement
  if (loading) {
    return <Loading message="Chargement des films..." />;
  }

  // Pas de films
  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Aucun film disponible</h2>
          <p className="text-gray-400">
            Revenez plus tard pour découvrir nos films.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar movies={movies} onSearch={""} />

      {/* Hero Section */}
      <MovieHeroCarousel />
      
      {/* Movies Lists */}
      <div className="container mx-auto">
        <MovieCarousel title="Films populaires" movies={popularMovies} />
        <MovieCarousel title="Films récents" movies={recentMovies} />

        {/* Section de recommandations personnalisées ou suggestions génériques */}
        {authenticated ? (
          <PersonalizedRecommendations />
        ) : (
          <MovieCarousel
            title="Suggestions personnalisées"
            movies={personalizedMovies}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
