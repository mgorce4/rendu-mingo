import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  rentalDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 7); // 7 jours par défaut
      return date;
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// INDEX composé pour éviter les doublons et optimiser les requêtes
rentalSchema.index({ user: 1, movie: 1 });
rentalSchema.index({ status: 1, expiryDate: 1 });

// VIRTUAL pour vérifier si la location est toujours valide
rentalSchema.virtual('isValid').get(function() {
  return this.status === 'active' && new Date() < this.expiryDate;
});

// VIRTUAL pour obtenir les jours restants
rentalSchema.virtual('daysLeft').get(function() {
  if (this.status !== 'active') return 0;
  const diff = this.expiryDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// MÉTHODE pour vérifier si la location est active
rentalSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.expiryDate;
};

// MÉTHODE pour marquer comme expiré
rentalSchema.methods.markAsExpired = async function() {
  this.status = 'expired';
  return await this.save();
};

// MÉTHODE STATIQUE pour obtenir les locations actives d'un utilisateur
rentalSchema.statics.getActiveRentals = function(userId) {
  return this.find({
    user: userId,
    status: 'active',
    expiryDate: { $gt: new Date() }
  })
  .populate('movie')
  .sort({ rentalDate: -1 });
};

// MÉTHODE STATIQUE pour obtenir les locations expirées
rentalSchema.statics.getExpiredRentals = function(userId) {
  return this.find({
    user: userId,
    $or: [
      { status: 'expired' },
      { expiryDate: { $lt: new Date() } }
    ]
  })
  .populate('movie')
  .sort({ expiryDate: -1 });
};

// MIDDLEWARE pre-find: Mettre à jour le statut des locations expirées
rentalSchema.pre(/^find/, async function() {
  // Marquer comme expirées les locations dont la date est dépassée
  await this.model.updateMany(
    {
      expiryDate: { $lt: new Date() },
      status: 'active'
    },
    { status: 'expired' }
  );
  
});

const Rental = mongoose.model('4a_Rental', rentalSchema);

export default Rental;
