import User from "../models/User.js";

// @desc    Mettre à jour les genres favoris d'un utilisateur
// @route   PUT /api/users/:id
// @access  Private (owner or admin)
export const updateUserFavoriteGenres = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favoriteGenres } = req.body;

    if (!Array.isArray(favoriteGenres)) {
      return res.status(400).json({
        success: false,
        message: "favoriteGenres doit être un tableau",
      });
    }

    // Autoriser uniquement le propriétaire du compte ou un admin
    if (req.user.role !== "admin" && String(req.user._id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé",
      });
    }

    const cleanedGenres = [
      ...new Set(
        favoriteGenres
          .filter((genre) => typeof genre === "string")
          .map((genre) => genre.trim())
          .filter(Boolean),
      ),
    ];

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    user.favoriteGenres = cleanedGenres;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Genres favoris mis à jour",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
