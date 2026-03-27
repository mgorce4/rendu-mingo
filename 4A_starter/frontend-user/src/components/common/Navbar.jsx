// components/common/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Components
import SearchBar from "../movies/SearchBar";
import CartButton from "./CartButton";

// Contexts
import { useAuth } from "../../context/AuthContext";

// Barre de navigation principale
function Navbar({ movies }) {
  // State pour le menu utilisateur et l'effet de scroll
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // Effet pour détecter le scroll et changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Action lors de la déconnexion
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black" : "bg-linear-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo avec Link */}
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-primary text-3xl font-bold tracking-tight hover:text-primary-dark transition"
            >
              ZEDFLIX
            </NavLink>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary font-bold"
                      : "text-gray-300 hover:text-white"
                  }
                >
                  Accueil
                </NavLink>
              </li>
              {isAuthenticated() && (
                <>
                  <li>
                    <NavLink
                      to="/my-rentals"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary font-bold"
                          : "text-gray-300 hover:text-white"
                      }
                    >
                      Mes locations
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <SearchBar movies={movies} />

            <button className="hover:text-gray-300 transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <CartButton />
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded cursor-pointer hover:ring-2 hover:ring-primary transition"
                  />
                  <span className="hidden md:block text-sm">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-lg border border-gray-800 rounded-lg shadow-xl py-2">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mon profil
                    </NavLink>
                    <NavLink
                      to="/my-rentals"
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mes locations
                    </NavLink>
                    
                    <hr className="border-gray-800 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 transition text-red-400"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition">
                  Connexion
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
