// pages/Cart.jsx
import { useNavigate } from "react-router-dom";

// Contexts
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Components
import Navbar from "../components/common/Navbar";
import Button from "../components/common/Button";
import Footer from "../components/layout/Footer";

// Page du panier
function Cart() {
  const navigate = useNavigate();
  const { success, error, warning } = useNotification();
  const { cart, removeFromCart, getCartTotal, rentAllInCart, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();

  // Action lors du clic sur "Louer tout"
  const handleRentAll = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Louer tous les films du panier
    const result = await rentAllInCart();
    let timeout = 0;
    if (result.failed && result.failed.length > 0) {
      timeout = 3000 + result.count * 100; // Temps d'affichage des succès + 100ms par film loué
      result.failed.map((f) => {
        setTimeout(() => warning(`${f.title} déjà loué !`), 100);
      });
    }

    if (result.success) {
      result.count > 0 &&
        success(`${result.count} film(s) loué(s) avec succès !`);
      setTimeout(() => navigate("/my-rentals"), timeout + 500);
    } else
      error(
        result.message || "Erreur lors de la location. Veuillez réessayer.",
      );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="container mx-auto px-4 py-24">
          <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-2xl text-gray-400 mb-6">Votre panier est vide</p>
            <Button onClick={() => navigate("/")}>Découvrir les films</Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des films */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((movie) => (
              <div
                key={movie._id}
                className="flex items-center bg-gray-900 rounded-lg p-4 border border-gray-800"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded"
                />

                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {movie.year} • {movie.genre.map((g) => g).join(", ")} •{" "}
                    {movie.duration} min
                  </p>
                  <p className="text-primary font-bold text-lg">
                    {movie.price.toFixed(2)}€
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(movie._id)}
                  className="text-red-400 hover:text-red-300 transition ml-4"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Résumé */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Résumé</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Nombre de films:</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Durée de location:</span>
                  <span>7 jours</span>
                </div>
                <hr className="border-gray-800" />
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    {getCartTotal().toFixed(2)}€
                  </span>
                </div>
              </div>

              <Button onClick={handleRentAll} className="w-full mb-3">
                Louer tout ({cart.length} film{cart.length > 1 ? "s" : ""})
              </Button>

              <button
                onClick={clearCart}
                className="w-full px-4 py-2 border border-gray-700 rounded hover:bg-gray-800 transition"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
