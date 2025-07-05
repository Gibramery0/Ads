import mongoose from 'mongoose';

// Mongoose model tanımı
const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  popular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Eğer model zaten tanımlanmışsa, onu kullan
const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

export default Game; 