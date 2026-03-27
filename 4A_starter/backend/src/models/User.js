import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false, // Ne pas retourner le password par défaut dans les queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=e50914&color=fff`;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    favoriteGenres: { type: [String], default: [] },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  },
);

// INDEX pour améliorer les performances
//userSchema.index({ email: 1 });// L'index sur email est déjà créé automatiquement grâce à unique: true

// MIDDLEWARE pre-save: Hasher le mot de passe avant sauvegarde
userSchema.pre("save", async function () {
  // Ne hasher que si le password a été modifié
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// MÉTHODE pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// MÉTHODE pour obtenir les infos publiques (sans password)
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// MÉTHODE statique pour trouver par email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model("4a_User", userSchema);

export default User;
