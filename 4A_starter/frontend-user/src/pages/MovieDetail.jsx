// React & Router
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";
import MovieCarousel from "../components/movies/MovieCarousel";
import Breadcrumb from "../components/common/Breadcrumb";

import Loading from "../components/common/Loading";
import LoadingError from "../components/common/LoadingError";

// Contexts
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

// Services API
import { moviesAPI } from "../services/api";

// Page de détail d'un film
function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const { isAuthenticated } = useAuth();
  const {
    addToCart,
    rentMovie,
    isInCart,
    rentalsIsLoading,
    getRentalByMovieId,
    isRented,
  } = useCart();

  // États locaux
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();
  const [rental, setRental] = useState(null);

  // Charger les détails du film , films similaires et les avis en parallèle
  const loadMovie = async () => {
    setLoading(true);

    try {
      // Trouver le film correspondant
      // Charger le film et les films similaires en parallèle
      const [movieResponse, similarResponse] = await Promise.all([
        moviesAPI.getById(id),
        moviesAPI.getSimilar(id).catch(() => ({ success: true, data: [] })),
        
      ]);

      if (movieResponse.success) {
        setMovie(movieResponse.data);
      } else {
        throw new Error(movieResponse.message || "Film introuvable");
      }

      if (similarResponse.success) {
        setSimilarMovies(similarResponse.data);
      }
    } catch (err) {
      error(err.message || "Erreur lors du chargement du film");
    } finally {
      setLoading(false);
    }
  };

  // Charger la location de ce film (si existante)
  const loadRental = () => {
    const rental = getRentalByMovieId(id);
    if (rental) {
      setRental(rental.status === "active" ? rental : null);
    }
  };

  // Charger les données au montage et à chaque changement d'ID
  useEffect(() => {
    loadMovie();
  }, [id]);

  // Recharger la location lorsque les données de location changent
  useEffect(() => {
    if (!rentalsIsLoading) {
      loadRental();
    }
  }, [rentalsIsLoading, id]);

  const inCart = isInCart(movie?._id);

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    const result = addToCart(movie);
    result.success ? success(result.message) : error(result.message);
  };

  // Gérer la location immédiate
  const handleRentNow = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Vérifier si le film est déjà loué
    if (isRented(movie._id)) {
      error("Vous avez déjà loué ce film");
      return;
    }

    // Louer le film
    const res = await rentMovie(movie);
    if (!res.success) {
      error(res.message || "Erreur lors de la location du film");
      return;
    }

    success("Film loué avec succès !");

    // Rediriger vers MyRentals après 2 secondes
    setTimeout(() => {
      navigate("/my-rentals");
    }, 2000);
  };

  if (loading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Film introuvable</h2>
          <p className="text-gray-400 mb-8">
            Le film que vous recherchez n'existe pas.
          </p>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <Breadcrumb
          items={[
            { label: "Films", path: "/" },
            ...movie.genre.map((g) => ({
              label: g,
              path: `/search?genre=${g}`,
            })),
            { label: movie.title },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-400 hover:text-white transition flex items-center"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour
            </button>

            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center flex-wrap gap-4 mb-6">
              <span className="bg-primary px-3 py-1 rounded font-bold">
                {movie.rating}/10
              </span>
              <span className="text-xl">{movie.year}</span>
              <span className="text-xl">{movie.duration} min</span>
              <span className="border border-gray-500 px-3 py-1 rounded">
                {movie.genre.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Synopsis</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {movie.description}
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {rental ? (
                <div className="bg-green-500/20 border border-green-500 text-green-500 px-6 py-3 rounded-lg">
                  ✓ Film loué jusqu'au{" "}
                  {new Date(rental.expiryDate).toLocaleDateString()}
                </div>
              ) : (
                <>
                  <Button size="lg" onClick={handleRentNow} className="flex-1">
                    🎬 Louer maintenant - {movie.price}€
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className="flex-1"
                  >
                    {inCart ? "✓ Dans le panier" : "+ Ajouter au panier"}
                  </Button>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Informations</h3>
              <dl className="space-y-3">
                <div className="flex border-b border-gray-800 pb-2">
                  <dt className="w-32 text-gray-400 font-semibold">Genre:</dt>
                  <dd className="flex-1">{movie.genre.join(", ")}</dd>
                </div>
                <div className="flex border-b border-gray-800 pb-2">
                  <dt className="w-32 text-gray-400 font-semibold">Année:</dt>
                  <dd className="flex-1">{movie.year}</dd>
                </div>
                <div className="flex border-b border-gray-800 pb-2">
                  <dt className="w-32 text-gray-400 font-semibold">Durée:</dt>
                  <dd className="flex-1">{movie.duration} minutes</dd>
                </div>
                <div className="flex">
                  <dt className="w-32 text-gray-400 font-semibold">Note:</dt>
                  <dd className="flex-1">
                    <span className="text-yellow-400 font-bold">
                      {movie.rating}/10
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column - Poster */}
          <div>
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl sticky top-24"
            />
          </div>
        </div>
      </div>


      {/* films similaires */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Films similaires</h2>

        <MovieCarousel movies={similarMovies} />
      </div>

      <Footer />
    </div>
  );
}

export default MovieDetail;
