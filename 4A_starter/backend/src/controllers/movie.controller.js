import Movie from "../models/Movie.js";

// @desc    Obtenir tous les films
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res, next) => {
  //TODO Cf 8ème séance
};

// @desc    Obtenir un film par ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res, next) => {
  //TODO Cf 8ème séance
};

// @desc    Créer un nouveau film
// @route   POST /api/movies
// @access  Private/Admin
export const createMovie = async (req, res, next) => {
  //TODO Cf 8ème séance

};

// @desc    Modifier un film
// @route   PUT /api/movies/:id
// @access  Private/Admin
export const updateMovie = async (req, res, next) => {
  //TODO Cf 8ème séance

};

// @desc    Supprimer un film
// @route   DELETE /api/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req, res, next) => {
  //TODO Cf 8ème séance
};

// @desc    Obtenir les statistiques des films
// @route   GET /api/movies/stats
// @access  Private/Admin
export const getMovieStats = async (req, res, next) => {
  try {
    const stats = await Movie.getStatsByGenre();

    const totalMovies = await Movie.countDocuments();
    const totalRevenue = await Movie.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$rentalCount"] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        estimatedRevenue: totalRevenue[0]?.total || 0,
        byGenre: stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les films similaires
// @route   GET /api/movies/:id/similar
// @access  Public
export const getSimilarMovies = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Film non trouvé",
      });
    }

    // Trouver des films du même genre
    const similarMovies = await Movie.find({
      genre: { $in: movie.genre },
      _id: { $ne: movie._id }, // Exclure le film actuel
      isAvailable: true,
    })
      .sort({ rating: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: similarMovies.length,
      data: similarMovies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les films les plus populaires
// @route   GET /api/movies/popular
// @access  Public
export const getPopularMovies = async (req, res, next) => {
  //TODO

};

// @desc    Obtenir les films récemment ajoutés
// @route   GET /api/movies/recent
// @access  Public
export const getRecentMovies = async (req, res, next) => {
  //TODO
  
};
// @desc    Obtenir les films d'un genre spécifique
// @route   GET /api/movies/genre/:genre
// @access  Public
export const getMoviesByGenre = async (req, res, next) => {
 //TODO
  
};

// @desc    Obtenir les films dans une fourchette de prix
// @route   GET /api/movies/price?min=0&max=10
// @access  Public
export const getMoviesByPriceRange = async (req, res, next) => {
//TODO
};

// @desc    Obtenir les statistiques par genre
// @route   GET /api/movies/stats/genre
// @access  Public
export const getStatsByGenre = async (req, res, next) => {
  //TODO
};

// @desc    Obtenir les recommandations basées sur les genres préférés de l'utilisateur
// @route   GET /api/movies/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  //TODO
};

// @desc    Liker un film
// @route   POST /api/movies/:id/like
// @access  Private
export const likeMovie = async (req, res, next) => {
  //TODO
};

// @desc    Unliker un film
// @route   POST /api/movies/:id/unlike
// @access  Private
export const unlikeMovie = async (req, res, next) => {
  //TODO
};

// @desc    Obtenir les films likés par un utilisateur
// @route   GET /api/movies/liked
// @access  Private
export const getLikedMoviesByUser = async (req, res, next) => {
  //TODO
};

// @desc    Obtenir des films aléatoires
// @route   GET /api/movies/random
// @access  Public
export const getRandomMovies = async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 10) limit = 10; // Limite maximale pour éviter les abus
    const randomMovies = await Movie.getRandomMovies(limit);

    res.status(200).json({
      success: true,
      count: randomMovies.length,
      data: randomMovies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Noter un film
// @route   POST /api/movies/:id/rate
// @access  Private
export const rateMovie = async (req, res, next) => {
  //TODO
};
