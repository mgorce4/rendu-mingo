// components/movies/SearchBar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ movies }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMovieSelectd, setIsMovieSelected] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = movies?.filter((movie) => {
        const term = searchTerm.toLocaleLowerCase();
        const title = movie.title.toLocaleLowerCase();
        const desc = movie.description.toLocaleLowerCase();

        return title.includes(term) || desc.includes(term);
      });
      setSuggestions(filtered?.slice(0, 5)); // Limiter à 5
      !isMovieSelectd && setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchTerm, movies]);

  // Action lors de la sélection d'un film dans les suggestions
  const handleSelect = (movie) => {
    setIsMovieSelected(true);
    setIsOpen(false);
    setSearchTerm(movie.title);
    // TODO: Action lors de la sélection
    navigate(`/movie/${movie._id}`);
  };

  // Fermer le dropdown si l'utilisateur modifie le texte après une sélection
  const handleChange = (e) => {
    isMovieSelectd && setIsMovieSelected(false);
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
          placeholder="Rechercher un film..."
          className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
        />
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* TODO: Dropdown de suggestions */}
      {isOpen && suggestions?.length > 0 && (
        <div className="absolute w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          {suggestions.map((movie) => (
            <div
              key={movie._id}
              onClick={() => handleSelect(movie)}
              className="flex items-center p-3 hover:bg-gray-800 cursor-pointer transition"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{movie.title}</h4>
                <p className="text-sm text-gray-400">
                  {movie.year} • {movie.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
