import { useState } from "react";

function MovieFilter({ movies, onFilter }) {
  const [selectedGenre, setSelectedGenre] = useState("all");

  // TODO: Extraire la liste unique des genres depuis movies
  const genres = [
    ...new Set(
      movies.flatMap((m) => (Array.isArray(m.genre) ? m.genre : [m.genre])),
    ),
  ].sort();

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);

    // TODO: Filtrer les films
    if (genre === "all") {
      onFilter(movies);
    } else {
      const filtered = movies.filter((m) =>
        Array.isArray(m.genre) ? m.genre.includes(genre) : m.genre === genre,
      );
      onFilter(filtered);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 px-4">
      <button
        onClick={() => handleGenreChange("all")}
        className={`px-4 py-2 rounded-lg transition ${
          selectedGenre === "all"
            ? "bg-primary text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        Tous
      </button>
      {/* Convertir les genres en Bouton */}
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleGenreChange(genre)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedGenre === genre
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default MovieFilter;
