import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import MovieDescription from "./MovieDescription";
import { useCart } from "../../context/CartContext";
import { useNotification } from "../../context/NotificationContext";
function MovieHero({ movie }) {
  const navigate = useNavigate();
  const { addToCart, isRented } = useCart();
  const { success, warning } = useNotification();

  const handleRent = () => {
    if (isRented(movie._id)) {
      warning("Film déjà loué");
      return;
    }
    const res = addToCart(movie);
    res.success ? success(res.message) : warning(res.message);
  };

  const handleMoreInfo = () => {
    navigate(`/movie/${movie._id}`);
  };

  movie?.genre && !Array.isArray(movie.genre) && (movie.genre = [movie.genre]);

  const rows = 5;
  const cols = 10;
  const totalCells = rows * cols;
  return movie && (
    <div
      key={movie._id}
      className="group relative h-[80vh] w-full overflow-hidden bg-black"
    >
      {/* Grille d'animation (Damier) */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {[...Array(totalCells)].map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;

          return (
            <div
              key={i}
              className="relative overflow-hidden animate-tileIn"
              style={{
                backgroundImage: `url(${movie.backdrop})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${(col * 100) / (cols - 1)}% ${(row * 100) / (rows - 1)}%`,
                // Délai aléatoire ou progressif pour l'effet damier
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
            />
          );
        })}
      </div>

      {/* Overlays (Gardés par-dessus la grille) */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent opacity-100 group-hover:opacity-50 transition-all duration-1000 " />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

      {/* Contenu textuel */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl animate-fadeInText">
          <h1 className="text-6xl font-bold mb-4 text-white">{movie.title}</h1>

          {/* Meta information */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <span className="bg-primary px-3 py-1 rounded text-sm font-bold">
              {movie.rating}/10
            </span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-300">{movie.duration} min</span>
            <span className="border border-gray-500 px-2 py-0.5 text-sm rounded">
              {movie.genre ? movie.genre.join(", ") : "Genre inconnu"}
            </span>
          </div>

          {/* Description */}
          {/* <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed drop-shadow-lg"> */}
            <MovieDescription description={movie.description} />
          {/* </p> */}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="shadow-2xl" onClick={handleRent}>
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Louer pour {movie.price}€
            </Button>
            <Button variant="secondary" size="lg" onClick={handleMoreInfo}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Plus d'infos
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) || (
    <div className="h-10 flex items-center justify-center bg-gray-900">
      <p className="text-gray-500 text-xl">Aucun film à afficher</p>
    </div>
  );
}

export default MovieHero;
