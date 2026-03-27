import Movie from '../models/Movie.js';
// @desc Obtenir tous les genres
// @route GET /api/genres
// @access Public
export const getAllGenres = async (req, res, next) => {
    try {
        const genres = await Movie.distinct('genre', { isAvailable: true });
        res.json(genres);
    }
    catch (error) {
        next(error);
    }
};