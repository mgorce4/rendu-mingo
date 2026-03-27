const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Fonction utilitaire pour gérer les requêtes fetch
 * @param {string} endpoint - L'endpoint de l'API
 * @param {object} options - Options de la requête fetch
 * @returns {Promise} - Promesse avec les données ou erreur
 */
const fetchAPI = async (endpoint, options = {}) => {
  // Récupérer le token depuis localStorage
  const token = localStorage.getItem("token");

  // Configuration par défaut
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Fusionner les options
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      // Cas spécial : 401 Unauthorized (token expiré/invalide)
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // window.location.href = "/login?badLogin=true";
      }

      // Essayer de parser le JSON d'erreur
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    // Parser et retourner les données JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {object} userData - { name, email, password }
   */
  register: async (userData) => {
    return await fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Connexion d'un utilisateur
   * @param {object} credentials - { email, password }
   */
  login: async (credentials) => {
    return await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  getMe: async () => {
    return await fetchAPI("/auth/me");
  },

  /**
   * Mettre à jour le profil
   * @param {object} updates - { name, email }
   */
  updateProfile: async (updates) => {
    return await fetchAPI("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Mettre à jour les genres favoris
   * @param {object} genresData - { favoriteGenres: string[] }
   */
  updateFavoriteGenres: async (genresData) => {
    return await fetchAPI("/auth/favorite-genres", {
      method: "PUT",
      body: JSON.stringify({ favoriteGenres: genresData }),
    });
  },

  /**
   * Changer le mot de passe
   * @param {object} passwords - { currentPassword, newPassword }
   */
  changePassword: async (passwords) => {
    return await fetchAPI("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwords),
    });
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    return await fetchAPI("/auth/logout", {
      method: "POST",
    });
  },
};

// ==================== MOVIES ENDPOINTS ====================

export const moviesAPI = {
  /**
   * Obtenir tous les films avec filtres optionnels
   * @param {object} params - { genre, year, search, sort, page, limit }
   */
  getAll: async (params = {}) => {
    // Construire la query string
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/movies?${queryString}` : "/movies";

    return await fetchAPI(endpoint);
  },

  /**
   * Obtenir un film par son ID
   * @param {string} id - ID du film
   */
  getById: async (id) => {
    return await fetchAPI(`/movies/${id}`);
  },

  /**
   * Obtenir les films similaires
   * @param {string} id - ID du film
   */
  getSimilar: async (id) => {
    return await fetchAPI(`/movies/${id}/similar`);
  },

  /**
   * Obtenir les films par genre
   * @param {string} genre - Genre du film
   */
  getByGenre: async (genre) => {
    // TODO
  },

  /**
   * Obtenir les films récents
   */
  getRecent: async () => {
    // TODO
  },

  /**
   * Obtenir les films populaires
   */
  getPopular: async () => {
    // TODO
  },

  /**
   * Obtenir les films au hasard
   * @param {*} limit
   * @returns
   */
  getRandom: async (limit = 10) => {
    return await fetchAPI(`/movies/random?limit=${limit}`);
  },

  /**
   * Créer un nouveau film (admin)
   * @param {object} movieData - Données du film
   */
  create: async (movieData) => {
    return await fetchAPI("/movies", {
      method: "POST",
      body: JSON.stringify(movieData),
    });
  },

  /**
   * Mettre à jour un film (admin)
   * @param {string} id - ID du film
   * @param {object} updates - Données à mettre à jour
   */
  update: async (id, updates) => {
    return await fetchAPI(`/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Supprimer un film (admin)
   * @param {string} id - ID du film
   */
  delete: async (id) => {
    return await fetchAPI(`/movies/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Obtenir les statistiques des films (admin)
   */
  getStats: async () => {
    return await fetchAPI("/movies/stats");
  },

  /**
   * Recherche avancée
   * @param {object} filters - Filtres de recherche
   */
  search: async (filters) => {
    const queryParams = new URLSearchParams(filters);
    return await fetchAPI(`/movies?${queryParams.toString()}`);
  },

  /**
   * Liker un film
   * @param {string} id - ID du film
   */
  like: async (id) => {
    return await fetchAPI(`/movies/${id}/like`, {
      method: "POST",
    });
  },

  /**
   * Unliker un film
   * @param {string} id - ID du film
   */
  unlike: async (id) => {
    return await fetchAPI(`/movies/${id}/unlike`, {
      method: "POST",
    });
  },
};
// ==================== GENRES ENDPOINTS ====================
export const genresAPI = {
  /**
   * Obtenir la liste des genres
   */
  getAll: async () => {
    //TODO
  },
};

// ==================== RENTALS ENDPOINTS ====================

export const rentalsAPI = {
  /**
   * Louer un film
   * @param {string} movieId - ID du film à louer
   */
  rent: async (movieId) => {
    return await fetchAPI("/rentals", {
      method: "POST",
      body: JSON.stringify({ movieId }),
    });
  },

  /**
   * Obtenir mes locations
   * @param {object} params - { status: 'active' | 'expired' | 'all' }
   */
  getMyRentals: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const endpoint = queryParams.toString()
      ? `/rentals/my-rentals?${queryParams.toString()}`
      : "/rentals/my-rentals";

    return await fetchAPI(endpoint);
  },

  /**
   * Obtenir toutes les locations (admin)
   * @param {object} params - { page, limit, status }
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const endpoint = queryParams.toString()
      ? `/rentals?${queryParams.toString()}`
      : "/rentals";

    return await fetchAPI(endpoint);
  },

  /**
   * Annuler une location
   * @param {string} id - ID de la location
   */
  cancel: async (id) => {
    return await fetchAPI(`/rentals/${id}`, {
      method: "DELETE",
    });
  },
};



// ==================== HELPER FUNCTIONS ====================

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Obtenir le token actuel
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Sauvegarder les données d'authentification
 */
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Supprimer les données d'authentification
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Obtenir l'utilisateur depuis localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Export par défaut
export default {
  authAPI,
  moviesAPI,
  rentalsAPI,
  isAuthenticated,
  getToken,
  saveAuth,
  clearAuth,
  getUser,
};
