// React & Router
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Components
import Template from "../components/common/Template";
import Button from "../components/common/Button";

// Services API
import { rentalsAPI } from "../services/api";
import Loading from "../components/common/Loading";
import LoadingError from "../components/common/LoadingError";

// Page de gestion des locations de l'utilisateur
function MyRentals() {
  // États locaux
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, expired
  const [filteredRentals, setFilteredRentals] = useState([]);

  // Filtrer les locations en fonction du filtre sélectionné
  useEffect(() => {
    let filtered = rentals;
    if (filter === "active") {
      filtered = rentals.filter((r) => r.status === "active");
    } else if (filter === "expired") {
      filtered = rentals.filter((r) => r.status === "expired");
    } else if (filter === "cancelled") {
      filtered = rentals.filter((r) => r.status === "cancelled");
    }
    setFilteredRentals(filtered);
  }, [filter, rentals]);

  // Charger les locations au changement de filtre
  useEffect(() => {
    fetchRentals();
  }, []);

  // Charger les locations de l'utilisateur
  const fetchRentals = async () => {
    setLoading(true);
    setError(false);

    try {
      const result = await rentalsAPI.getMyRentals();
      if (!result.success) {
        throw new Error(
          result.message || "Erreur lors du chargement des locations",
        );
      }
      setRentals(result.data); // Mettre à jour les locations dans l'état local
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des locations");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculer les jours restants
   */
  const getDaysLeft = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  /**
   * Vérifier si une location est active
   */
  const isActive = (rental) => {
    return (
      rental.status === "active" && new Date(rental.expiryDate) > new Date()
    );
  };

  // Annuler une location
  const handleCancelRental = async (rentalId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette location ?")) {
      return;
    }

    try {
      const result = await rentalsAPI.cancel(rentalId);
      if (!result.success) {
        throw new Error(result.message || "Erreur lors de l'annulation");
      }
      //Mofier le statut de la location dans l'état local
      setRentals((prev) =>
        prev.map((r) =>
          r._id === rentalId ? { ...r, status: "cancelled" } : r,
        ),
      );
    } catch (err) {
      alert(err.message || "Erreur lors de l'annulation de la location");
    }
  };

  // Filtrer les locations
  const activeRentals = rentals.filter((r) => isActive(r));
  const expiredRentals = rentals.filter((r) => r.status === "expired");
  const cancelledRentals = rentals.filter((r) => r.status === "cancelled");

  // État de chargement
  if (loading) return <Loading />;

  // État d'erreur
  if (error) return <LoadingError fetchData={fetchRentals} error={error} />;

  return (
    <Template
      title="Mes locations"
      intro="Gérez vos locations de films et découvrez vos prochaines expirations."
      data={rentals}
      emptyMessage="Vous n'avez aucune location pour le moment. Découvrez nos films et louez votre prochain coup de cœur !"
      fetchData={fetchRentals}
      error={error}
      loading={loading}
      summary={`location%`}
    >
      {/* Filtres */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded transition ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Toutes ({rentals.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded transition ${
            filter === "active"
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Actives ({activeRentals.length})
        </button>
        <button
          onClick={() => setFilter("expired")}
          className={`px-4 py-2 rounded transition ${
            filter === "expired"
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Expirées ({expiredRentals.length})
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded transition ${
            filter === "cancelled"
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Annulées ({cancelledRentals.length})
        </button>
      </div>
      {/* Liste des locations */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRentals.map((rental) => {
          const active = isActive(rental);
          const daysLeft = getDaysLeft(rental.expiryDate);

          return (
            <div
              key={rental._id}
              className={`bg-gray-900 rounded-lg overflow-hidden border ${
                active ? "border-green-500/50" : "border-gray-800"
              } hover:border-gray-700 transition`}
            >
              <Link to={`/movie/${rental.movie._id}`} className="block">
                <div className="relative">
                  <img
                    src={rental.movie.poster}
                    alt={rental.movie.title}
                    className="w-full h-64 object-cover"
                  />
                  {active && (
                    <div className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded text-xs font-bold">
                      Actif
                    </div>
                  )}
                  {!active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-red-400 font-bold text-lg">
                        {rental.status == "expired"
                          ? " (Expiré)"
                          : "Annulé"}{" "}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">
                  {rental.movie.title}
                </h3>

                <div className="text-sm text-gray-400 space-y-1 mb-3">
                  <p>
                    Loué le: {new Date(rental.rentalDate).toLocaleDateString()}
                  </p>
                  <p>
                    Expire le:{" "}
                    {new Date(rental.expiryDate).toLocaleDateString()}
                  </p>
                  {active && (
                    <p className="text-green-400 font-semibold">
                      {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant
                      {daysLeft > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link to={`/movie/${rental.movie._id}`} className="flex-1">
                    <button className="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition">
                      Voir le film
                    </button>
                  </Link>
                  {active && (
                    <button
                      onClick={() => handleCancelRental(rental._id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                      title="Annuler la location"
                    >
                      ❌
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Template>
  );
}

export default MyRentals;
