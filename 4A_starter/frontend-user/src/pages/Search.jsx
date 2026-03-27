// Page de recherche avec filtres
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// Components
import Navbar from "../components/common/Navbar";
import MovieCard from "../components/movies/MovieCard";

import { useNotification } from "../context/NotificationContext";

// Services API
import { moviesAPI, genresAPI } from "../services/api";

// Page de recherche avec filtres
function Search() {
  // États locaux
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    sort: searchParams.get("sort") || "rating",
  });
  const [movies, setMovies] = useState([]);
  const { error } = useNotification();


  //chargement des genres
  const [genres, setGenres] = useState([]);
  const loadGenres = async () => {
    try {
      const res = await genresAPI.getAll();
      if (!res?.success) {
        throw new Error(res?.message || "Erreur lors du chargement des genres");
      }
      setGenres(res.data);
    } catch (err) {
      error(err?.message || "Erreur lors du chargement des genres");
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  // Récupérer la query de recherche
  const query = searchParams.get("q") || "";

  const loadMovies = async () => {
    try {
      console.log(query);
      
      const res = await moviesAPI.search({ q: query, ...filters });
      if (!res?.success) {
        throw new Error(res?.message || "Erreur lors de la recherche");
      }
      setMovies(res.data);
      setTotal(res.total);
    } catch (err) {
      error(err?.message || "Erreur lors de la recherche");
    }
  };

  // Recharger les films à chaque changement de query ou de filtres
  useEffect(() => {
    
    loadMovies();
  }, [query, filters]);

  // Gérer les changements de filtres
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Mettre à jour l'URL
    const newParams = { q: query, ...newFilters };
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-2">Résultats pour "{query}"</h1>
        <p className="text-gray-400 mb-8">{total} film(s) trouvé(s)</p>

        {/* Filtres */}
        <div className="flex gap-4 mb-8">
          {/*Zone de recherche */}
          <input
            type="text"
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value, ...filters })}
            placeholder="Rechercher un film..."
            className="flex-1 px-4 py-2 bg-gray-800 rounded"
          />

          {/* Liste déroulante de genres*/}
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded"
          >
            <option value="">Tous les genres</option>
            {/*  Options de genres */}
            {genres.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Liste déroulante de tri */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded"
          >
            <option value="rating">Note</option>
            <option value="year">Année</option>
            <option value="title">Titre</option>
          </select>

            {/* Liste déroulante de pagination */}
            <select
            value={filters.limit}
            onChange={(e) => handleFilterChange("limit", e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded"
          >
            <option value="10">10 par page</option>
            <option value="20">20 par page</option>
            <option value="50">50 par page</option>
          </select>
        </div>

        {/* Résultats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
