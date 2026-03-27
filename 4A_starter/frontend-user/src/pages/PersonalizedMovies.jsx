// PersonalizedMovies.jsx
import { useEffect } from "react";

// Components
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import MoviesByFavoriteGenres from "../components/movies/MoviesByFavoriteGenres";
import Template from "../components/common/Template";

// Context
import { useAuth } from "../context/AuthContext";

// Hooks
import { useNavigate } from "react-router-dom";

// Page des films personnalisés
function PersonalizedMovies() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login?redirect=/personalized");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Template>
      <MoviesByFavoriteGenres />
    </Template>
  );
}

export default PersonalizedMovies;
