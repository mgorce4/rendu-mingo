import { createContext, useState, useContext, useEffect } from "react";
import { authAPI, saveAuth, clearAuth, getUser } from "../services/api";
import { use } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState([]);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getUser();
      const token = localStorage.getItem("token");

      if (token && storedUser) {
        try {
          // Vérifier que le token est toujours valide
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          console.error("Error loading user:", error);
          clearAuth();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const fetchLikedMovies = async () => {
    try {
      const response = await authAPI.getLikedMovies();
      if (response.success) {
        setLikedMovies(response.data);
      } else {
        throw new Error(
          response.message || "Erreur lors de la récupération des films likés",
        );
      }
    } catch (error) {
      setLikedMovies([]);
      console.error(
        "Error fetching liked movies:",
        error.message || "Erreur lors de la récupération des films likés",
      );
    }
  };

  // Charger les films likés de l'utilisateur à chaque changement de l'utilisateur

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        const { token, user } = response;
        saveAuth(token, user);
        setUser(user);
        return { success: true };
      }

      return {
        success: false,
        error: response.message || "Erreur de connexion",
      };
    } catch (error) {
      return { success: false, error: error.message || "Erreur de connexion" };
    }
  };

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.success) {
        const { token, user } = response;
        saveAuth(token, user);
        setUser(user);
        return { success: true };
      }

      return {
        success: false,
        error: response.message || "Erreur d'inscription",
      };
    } catch (error) {
      return { success: false, error: error.message || "Erreur d'inscription" };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuth();
      setUser(null);
    }
  };

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return user !== null;
  };

  // Mettre à jour le profil
  const updateProfile = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);

      if (response.success) {
        const updatedUser = response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
      return {
        success: false,
        error: response.message || "Erreur de mise à jour du profil",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erreur de mise à jour du profil",
      };
    }
  };
  //Mettre à jour les genres favoris
  const updateFavoriteGenres = async (updatedGenres) => {
    //TODO
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        return { success: true };
      }
      return {
        success: false,
        error: response.message || "Erreur de changement de mot de passe",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erreur de changement de mot de passe",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    updateProfile,
    updateFavoriteGenres,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
