import React, { useState, useEffect, useCallback } from "react";

// Components
import MovieHero from "./MovieHero";
import Loading from "../common/Loading";

// Context
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

// Services
import { moviesAPI, rentalsAPI } from "../../services/api";

const MovieHeroCarousel = () => {
  // États locaux
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();
  const { isAuthenticated, user } = useAuth();

  // 1. Memoize de la fonction de sélection aléatoire pour éviter les redéfinitions à chaque rendu
  const selectRandomMovie = useCallback((movieList) => {
    if (movieList && movieList.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieList.length);
      setMovie(movieList[randomIndex]);
    }
  }, []);

  // 2. Chargement des films aléatoires ou des recommandations à l'initialisation du composant
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await moviesAPI.getRandom();
        if (response.success) {
          setMovies(response.data);
          selectRandomMovie(response.data); // Set initial movie
        } else {
          throw new Error(response.message || "Erreur lors du chargement");
        }
      } catch (err) {
        error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [error, selectRandomMovie, isAuthenticated(), user]);

  // 3. Sélection d'un nouveau film toutes les 5 secondes
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      selectRandomMovie(movies);
    }, 5000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, [movies, selectRandomMovie]);

  if (loading) return <Loading />;

  return <>{movie && <MovieHero movie={movie} />}</>;
};

export default MovieHeroCarousel;
