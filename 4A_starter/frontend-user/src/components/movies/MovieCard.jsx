// MovieCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Components
import Button from "../common/Button";

// Contexts
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

// Services
import { moviesAPI } from "../../services/api";
import { genreColors } from "../../services/genreColors";

// Carte de film
function MovieCard({ movie }) {
  const {
    id = movie._id,
    poster,
    title,
    rating,
    year,
    genre,
    description,
    price,
    duration,
  } = movie;

  // États locaux
  const [likes, setLikes] = useState(movie.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart, isRented } = useCart();
  const { success, warning, error } = useNotification();
  const { isAuthenticated, user } = useAuth();

  // TODO : Vérifier si le film est déjà liké par l'utilisateur

  // Gérer le like d'un film
  const handleLike = async (e) => {
    //TODO : PAs votre groupe
  };

  // Gérer la location d'un film
  const handleRent = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRented(id)) {
      warning("Film déjà loué");
      return;
    }

    const res = addToCart(movie);
    res.success ? success(res.message) : warning(res.message);
  };

  const arrGenre = Array.isArray(genre) ? genre : [genre];

  return (
    <Link to={`/movie/${id}`} className="block">
      <div className="group/card relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Image principale */}
        <div className="relative aspect-2/3">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Badge de note */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded">
            <span className="text-yellow-400 font-bold text-sm">
              ⭐ {rating}
            </span>
          </div>
        </div>

        {/* TODO: Ajouter un badge de genre en bas à gauche */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {arrGenre.map((g) => (
            <div
              key={g}
              className={` ${genreColors[g] || "bg-gray-500"} px-2 py-1 rounded text-xs font-bold`}
            >
              {g}
            </div>
          ))}
        </div>

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded ${
              isLiked ? "bg-red-500" : "bg-gray-500"
            }`}
          >
            {isLiked ? "❤️" : "🤍"} {likes} likes
          </button>

          <div className="flex items-center space-x-3 mb-3 text-sm">
            <span className="text-green-400 font-semibold">{rating}/10</span>
            <span className="text-gray-400">{year}</span>
            <span className="text-gray-400">{duration}min</span>
          </div>

          <p className="text-sm text-gray-300 mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" className="flex-1" onClick={handleRent}>
              ▶ Louer {price}€
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              + Info
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
