// context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

// Services
import { rentalsAPI } from "../services/api";

// Contextes
import { useAuth } from "./AuthContext";


const CartContext = createContext();

// Fournisseur de contexte pour le panier
export function CartProvider({ children }) {
  // Initialiser le panier depuis localStorage
  const initCart = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  };

  // États locaux
  const [cart, setCart] = useState(initCart);
  const [rentals, setRentals] = useState([]);
  const [rentalsIsLoading, setRentalsIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  // Charger les locations de l'utilisateur
  const fetchRentals = async () => {
    setRentalsIsLoading(true);
    try {
      if (!isAuthenticated()) return setRentals([]);

      const response = await rentalsAPI.getMyRentals();
      if (!response.success) {
        throw new Error(
          response.message || "Erreur lors du chargement des locations",
        );
      }

      setRentals(response.data); // Mettre à jour les locations dans l'état local
    } catch (error) {
      setRentals([]); // En cas d'erreur, initialiser à un tableau vide
      console.error("Error loading rentals:", error);
    } finally {
      setRentalsIsLoading(false);
    }
  };

  //Chargement des locations au montage du composant et à chaque changement d'authentification
  useEffect(() => {
    fetchRentals();
  }, [isAuthenticated()]);

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajouter au panier
  const addToCart = (movie) => {
    const exists = cart.find((item) => item._id === movie._id);

    if (exists) {
      return { success: false, message: "Film déjà dans le panier" };
    }

    setCart([...cart, movie]);
    return { success: true, message: "Film ajouté au panier" };
  };

  // Retirer du panier
  const removeFromCart = (movieId) => {
    setCart(cart.filter((item) => item._id !== movieId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer le total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // Nombre d'items
  const getCartCount = () => {
    return cart.length;
  };

  // Louer un film
  const rentMovie = async (movie) => {
    try {
      if (isRented(movie._id))
        return { success: false, yet: true, message: "Film déjà loué", movie };

      const result = await rentalsAPI.rent(movie._id);
      if (!result.success) {
        throw new Error(result.message || "Erreur lors de la location");
      }
      const rental = result.data;

      // Ajouter la location à l'état local et retirer le film du panier
      setRentals([...rentals, rental]);
      removeFromCart(movie._id);

      return { success: true, rental };
    } catch (error) {
      console.error("Error renting movie:", error);
      return {
        success: false,
        message: error.message || "Erreur lors de la location",
      };
    }
  };

  // Louer tous les films du panier
  const rentAllInCart = async () => {
    const results = await Promise.all(cart.map((movie) => rentMovie(movie)));

    // Filtrer les échecs de location
    const failedRentals = results
      .filter((res) => !res.success)
      .map((res) => res.movie);

      //Filter les locations déjà louées
      const yetRentals = results
      .filter((res) => res.yet)
      .map((res) => res.movie);

    // Filtrer les locations réussies
    const successfulRentals = results
      .filter((res) => res.success)
      .map((res) => res.rental);

    // Mettre à jour les locations et vider le panier
    setRentals([...rentals, ...successfulRentals]);
    clearCart();

    return {
      success: (successfulRentals.length + yetRentals.length) > 0 ,
      count: successfulRentals.length,
      failed: failedRentals,
    };
  };

  // Vérifier si un film est dans le panier
  const isInCart = (movieId) => {
    return cart.some((item) => item._id === movieId);
  };

  // Vérifier si un film est loué
  const isRented = (movieId) => {

    const resp = rentals.some(
      (rental) =>
        rental.movie._id === movieId &&
        new Date(rental.expiryDate) > new Date() &&
        rental.status === "active",
    );
    return resp;
  };

  // Obtenir la location d'un film
  const getRentalByMovieId = (movieId) => {
    return (
      rentals.find(
        (rental) => rental.movie._id === movieId && rental.status === "active",
      ) || null
    );
  };

  // Valeur du contexte
  const value = {
    cart,
    rentals,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    rentMovie,
    rentAllInCart,
    isRented,
    getRentalByMovieId,
    isInCart,
    rentalsIsLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
