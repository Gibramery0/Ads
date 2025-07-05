const mongoose = require('mongoose');
const { Document, Schema } = mongoose;

export interface IGame extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  thumbnail: string;
  featured: boolean;
  rating?: number;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Action',
      'Adventure', 
      'Puzzle',
      'Strategy',
      'Sports',
      'Racing',
      'Simulation',
      'RPG',
      'Arcade',
      'Casual',
      'Educational',
      'Multiplayer'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP/HTTPS URL'
    }
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Thumbnail must be a valid image URL'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  playCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
GameSchema.index({ category: 1 });
GameSchema.index({ tags: 1 });
GameSchema.index({ featured: 1 });
GameSchema.index({ playCount: -1 });
GameSchema.index({ createdAt: -1 });
GameSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for formatted play count
GameSchema.virtual('formattedPlayCount').get(function() {
  if (this.playCount >= 1000000) {
    return Math.floor(this.playCount / 1000000) + 'M';
  } else if (this.playCount >= 1000) {
    return Math.floor(this.playCount / 1000) + 'K';
  }
  return this.playCount.toString();
});

const Game = mongoose.model('Game', GameSchema);

module.exports = { Game };
