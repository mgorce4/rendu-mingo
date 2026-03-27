// Home.jsx
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import MovieCarousel from "../components/movies/MovieCarousel";
import MovieHeroCarousel from "../components/movies/MovieHeroCarousel";
import Loading from "../components/common/Loading";

// Context
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Services
import { moviesAPI } from "../services/api";

// Page d'accueil
function Home() {
  // États locaux
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();
  const { error } = useNotification();

  // Fonction pour charger les films
  const fetchMovies = async () => {
    try {
      setLoading(true);

      // Appel API avec fetch
      const response = await moviesAPI.getAll();

      if (response.success) {
        setMovies(response.data);
      } else {
        throw new Error(response.message || "Erreur lors du chargement");
      }
    } catch (err) {
      error(err.message);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les films
  useEffect(() => {
    fetchMovies();
  }, []);

  //TODO: Charger les genres favoris de l'utilisateur

  //TODO: Charger les films populaires

  //TODO: Charger les films récents

  //TODO: Charger les films pour chaque genre préféré

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
        <MovieCarousel title="Films populaires" movies={[]} />
        <MovieCarousel title="Films récents" movies={[]} />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
