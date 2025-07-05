const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// MongoDB Game Schema - Gerçek koleksiyon yapısına göre
const gameSchema = new mongoose.Schema({
  // Ana alanlar
  Id: String,
  Title: String,
  Developer: String,
  Description: String,
  'Sub Type': String,
  'Game URL': String,
  'GD URL': String,

  // Array alanlar
  Genres: [String],
  Tags: [String],
  Assets: [String],
  'Mobile Ready': [String],
  Gender: [String],
  'Age Group': [String],

  // Diğer alanlar
  Instructions: String,
  'Key Features': String,
  'Is Exclusive': String,
  'No Blood': String,
  'No Cruelty': String,
  'Kids Friendly': String,
  Width: Number,
  Height: Number,

  // Ek alanlar (eski uyumluluk için)
  title: String,
  description: String,
  category: String,
  tags: [String],
  url: String,
  thumbnail: String,
  featured: { type: Boolean, default: false },
  playCount: { type: Number, default: 0 },
  rating: Number
}, {
  collection: 'games',
  strict: false // MongoDB'deki ekstra alanları da kabul et
});

const Game = mongoose.model('Game', gameSchema);

// Simple GraphQL schema for testing
const typeDefs = `
  type Game {
    id: ID!
    title: String!
    description: String
    category: String
    tags: [String]
    url: String
    thumbnail: String
    featured: Boolean
    playCount: Int
    developer: String
    width: Int
    height: Int
  }

  type Query {
    games(limit: Int, offset: Int): [Game]
    game(id: ID!): Game
    featuredGames(limit: Int, offset: Int): [Game]
    popularGames(limit: Int, offset: Int): [Game]
    gamesByCategory(category: String!, limit: Int, offset: Int): [Game]
  }

  type Mutation {
    incrementPlayCount(gameId: ID!): Game
  }
`;

// Sample data for testing
const sampleGames = [
  {
    id: '1',
    title: 'Super Adventure',
    description: 'Harika bir macera oyunu',
    category: 'Adventure',
    tags: ['adventure', 'action'],
    url: 'https://example.com/game1',
    thumbnail: 'https://via.placeholder.com/300x200',
    featured: true,
    playCount: 1500
  },
  {
    id: '2',
    title: 'Puzzle Master',
    description: 'Zeka oyunu',
    category: 'Puzzle',
    tags: ['puzzle', 'brain'],
    url: 'https://example.com/game2',
    thumbnail: 'https://via.placeholder.com/300x200',
    featured: false,
    playCount: 2300
  },
  {
    id: '3',
    title: 'Racing Pro',
    description: 'Hızlı yarış oyunu',
    category: 'Racing',
    tags: ['racing', 'speed'],
    url: 'https://example.com/game3',
    thumbnail: 'https://via.placeholder.com/300x200',
    featured: true,
    playCount: 3200
  },
  {
    id: '4',
    title: 'Space Shooter',
    description: 'Uzay savaş oyunu',
    category: 'Action',
    tags: ['action', 'space', 'shooter'],
    url: 'https://example.com/game4',
    thumbnail: 'https://via.placeholder.com/300x200',
    featured: false,
    playCount: 1800
  },
  {
    id: '5',
    title: 'Football Manager',
    description: 'Futbol yönetim oyunu',
    category: 'Sports',
    tags: ['sports', 'football', 'management'],
    url: 'https://example.com/game5',
    thumbnail: 'https://via.placeholder.com/300x200',
    featured: true,
    playCount: 2700
  }
];

// MongoDB resolvers
const resolvers = {
  Query: {
    games: async (_, { limit = 1000, offset = 0 }) => {
      try {
        console.log('🔍 GraphQL games query called with limit:', limit, 'offset:', offset);
        const games = await Game.find({}).skip(offset).limit(limit);
        console.log('📊 Found games:', games.length);
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || game.title || 'Untitled Game',
          description: game.Description || game.description || 'Harika bir oyun!',
          category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
          tags: game.Tags || game.tags || [],
          url: game['Game URL'] || game.url || '#',
          thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
          featured: game.featured || Math.random() > 0.7,
          playCount: game.playCount || Math.floor(Math.random() * 5000),
          developer: game.Developer || 'Unknown',
          width: game.Width || 800,
          height: game.Height || 600
        }));
      } catch (error) {
        console.error('Error fetching games:', error);
        return sampleGames; // Fallback to sample data
      }
    },

    game: async (_, { id }) => {
      try {
        const game = await Game.findById(id);
        if (!game) return null;

        return {
          id: game._id.toString(),
          title: game.Title || game.title || 'Untitled Game',
          description: game.Description || game.description || 'Harika bir oyun!',
          category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
          tags: game.Tags || game.tags || [],
          url: game['Game URL'] || game.url || '#',
          thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || Math.floor(Math.random() * 5000),
          developer: game.Developer || 'Unknown',
          width: game.Width || 800,
          height: game.Height || 600
        };
      } catch (error) {
        console.error('Error fetching game:', error);
        return null;
      }
    },

    featuredGames: async (_, { limit = 50, offset = 0 }) => {
      try {
        const games = await Game.find({ featured: true }).skip(offset).limit(limit);
        if (games.length === 0) {
          // Eğer featured oyun yoksa, rastgele oyunları featured olarak işaretle
          const randomGames = await Game.find({}).limit(limit || 50);
          return randomGames.map(game => ({
            id: game._id.toString(),
            title: game.Title || game.title || 'Untitled Game',
            description: game.Description || game.description || 'Harika bir oyun!',
            category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
            tags: game.Tags || game.tags || [],
            url: game['Game URL'] || game.url || '#',
            thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
            featured: true,
            playCount: game.playCount || Math.floor(Math.random() * 5000),
            developer: game.Developer || 'Unknown'
          }));
        }
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || game.title || 'Untitled Game',
          description: game.Description || game.description || 'Harika bir oyun!',
          category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
          tags: game.Tags || game.tags || [],
          url: game['Game URL'] || game.url || '#',
          thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
          featured: game.featured,
          playCount: game.playCount || Math.floor(Math.random() * 5000),
          developer: game.Developer || 'Unknown'
        }));
      } catch (error) {
        console.error('Error fetching featured games:', error);
        return sampleGames.filter(game => game.featured);
      }
    },

    popularGames: async (_, { limit = 50, offset = 0 }) => {
      try {
        const games = await Game.find({}).sort({ playCount: -1 }).skip(offset).limit(limit);
        if (games.length === 0) {
          return sampleGames.sort((a, b) => b.playCount - a.playCount);
        }
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || game.title || 'Untitled Game',
          description: game.Description || game.description || 'Harika bir oyun!',
          category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
          tags: game.Tags || game.tags || [],
          url: game['Game URL'] || game.url || '#',
          thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || Math.floor(Math.random() * 5000),
          developer: game.Developer || 'Unknown'
        }));
      } catch (error) {
        console.error('Error fetching popular games:', error);
        return sampleGames.sort((a, b) => b.playCount - a.playCount);
      }
    },

    gamesByCategory: async (_, { category, limit = 50, offset = 0 }) => {
      try {
        console.log('🔍 GraphQL gamesByCategory query called with category:', category, 'limit:', limit, 'offset:', offset);

        // Kategori ile eşleşen oyunları bul (Genres array'inde arama yap)
        const games = await Game.find({
          $or: [
            { 'Genres': { $regex: new RegExp(category, 'i') } },
            { 'category': { $regex: new RegExp(category, 'i') } }
          ]
        }).skip(offset).limit(limit);

        console.log('📊 Found games for category:', games.length);

        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || game.title || 'Untitled Game',
          description: game.Description || game.description || 'Harika bir oyun!',
          category: (game.Genres && game.Genres[0]) || game.category || category,
          tags: game.Tags || game.tags || [],
          url: game['Game URL'] || game.url || '#',
          thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
          featured: game.featured || Math.random() > 0.7,
          playCount: game.playCount || Math.floor(Math.random() * 10000),
          developer: game.Developer || 'Unknown Developer',
          width: game.Width || 800,
          height: game.Height || 600
        }));
      } catch (error) {
        console.error('Error fetching games by category:', error);
        return sampleGames.filter(game =>
          game.category.toLowerCase().includes(category.toLowerCase())
        );
      }
    }
  },

  Mutation: {
    incrementPlayCount: async (_, { gameId }) => {
      try {
        const game = await Game.findByIdAndUpdate(
          gameId,
          { $inc: { playCount: 1 } },
          { new: true }
        );
        if (game) {
          return {
            id: game._id.toString(),
            title: game.Title || game.title || 'Untitled Game',
            description: game.Description || game.description || 'Harika bir oyun!',
            category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
            tags: game.Tags || game.tags || [],
            url: game['Game URL'] || game.url || '#',
            thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
            featured: game.featured || false,
            playCount: game.playCount,
            developer: game.Developer || 'Unknown'
          };
        }
        return null;
      } catch (error) {
        console.error('Error incrementing play count:', error);
        return null;
      }
    }
  }
};

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // CORS configuration
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true,
  }));

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      console.error('GraphQL Error:', err);
      console.error('Error Details:', {
        message: err.message,
        locations: err.locations,
        path: err.path,
        extensions: err.extensions
      });
      return err;
    },
    introspection: true,
    playground: true
  });

  await server.start();

  // Apply GraphQL middleware
  app.use('/graphql', 
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  // GraphQL Test endpoint
  app.post('/test-graphql', async (req, res) => {
    try {
      const games = await Game.find({}).limit(3);
      const result = games.map(game => ({
        id: game._id.toString(),
        title: game.Title || game.title || 'Untitled Game',
        thumbnail: (game.Assets && game.Assets[0]) || 'placeholder'
      }));

      res.json({
        success: true,
        message: 'GraphQL test successful',
        games: result,
        totalGames: await Game.countDocuments()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Simple games endpoint for testing
  app.get('/api/test-games', async (req, res) => {
    try {
      const games = await Game.find({}).limit(5);
      const result = games.map(game => ({
        id: game._id.toString(),
        title: game.Title || game.title || 'Untitled Game',
        description: game.Description || game.description || 'Harika bir oyun!',
        category: (game.Genres && game.Genres[0]) || game.category || 'Casual',
        tags: game.Tags || game.tags || [],
        url: game['Game URL'] || game.url || '#',
        thumbnail: (game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/300x200',
        featured: game.featured || Math.random() > 0.7,
        playCount: game.playCount || Math.floor(Math.random() * 5000),
        developer: game.Developer || 'Unknown',
        width: game.Width || 800,
        height: game.Height || 600
      }));

      res.json({
        success: true,
        games: result,
        totalGames: await Game.countDocuments()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Health check
  app.get('/health', async (req, res) => {
    try {
      const gameCount = await Game.countDocuments();
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Manyak Oyunlar API is running!',
        database: 'games',
        collection: 'games',
        games: gameCount,
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      });
    } catch (error) {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Manyak Oyunlar API is running!',
        database: 'games',
        games: 'Error counting games',
        mongodb: 'Error',
        error: error.message
      });
    }
  });

  // Debug endpoint - MongoDB collections
  app.get('/debug/collections', async (req, res) => {
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);

      const result = {
        database: 'games',
        collections: collectionNames,
        totalCollections: collectionNames.length
      };

      // Her collection'daki döküman sayısını da ekleyelim
      for (const collectionName of collectionNames) {
        try {
          const count = await db.collection(collectionName).countDocuments();
          result[`${collectionName}_count`] = count;

          // Eğer games collection'ı ise, örnek bir döküman da göster
          if (collectionName === 'games' && count > 0) {
            const sampleDoc = await db.collection(collectionName).findOne({});
            result.sampleGame = {
              id: sampleDoc._id,
              title: sampleDoc.Title || sampleDoc.title,
              hasAssets: !!(sampleDoc.Assets && sampleDoc.Assets.length > 0),
              hasGameURL: !!(sampleDoc['Game URL'] || sampleDoc.url),
              assetsCount: sampleDoc.Assets ? sampleDoc.Assets.length : 0,
              firstAsset: sampleDoc.Assets ? sampleDoc.Assets[0] : null,
              gameURL: sampleDoc['Game URL'] || sampleDoc.url
            };
          }
        } catch (err) {
          result[`${collectionName}_count`] = 'Error';
        }
      }

      res.json(result);
    } catch (error) {
      res.json({
        error: error.message,
        database: 'games',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      });
    }
  });

  // Oyun sayısını kontrol et
  app.get('/debug/count', async (req, res) => {
    try {
      const totalGames = await Game.countDocuments();
      const featuredGames = await Game.countDocuments({ featured: true });
      const sampleGame = await Game.findOne({});

      res.json({
        totalGames,
        featuredGames,
        sampleGame: sampleGame ? {
          id: sampleGame._id,
          title: sampleGame.Title || sampleGame.title,
          thumbnail: (sampleGame.Assets && sampleGame.Assets[0]) || sampleGame.thumbnail,
          developer: sampleGame.Developer,
          category: (sampleGame.Genres && sampleGame.Genres[0]) || sampleGame.category
        } : null
      });
    } catch (error) {
      res.json({
        error: error.message
      });
    }
  });

  // Seed endpoint - Sadece test için (gerçek veritabanında kullanma)
  app.post('/debug/seed-test', async (req, res) => {
    try {
      const fallbackGames = [
        {
          title: 'Super Adventure Quest',
          description: 'Epik bir macera oyunu. Ejderhalarla savaş, hazineler bul!',
          category: 'Adventure',
          tags: ['adventure', 'action', 'fantasy'],
          url: 'https://example.com/super-adventure',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=80',
          featured: true,
          playCount: 2500
        },
        {
          title: 'Brain Puzzle Master',
          description: 'Zeka oyunu. Beynini zorla ve bulmacaları çöz!',
          category: 'Puzzle',
          tags: ['puzzle', 'brain', 'logic'],
          url: 'https://example.com/brain-puzzle',
          thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 1800
        },
        {
          title: 'Speed Racing Pro',
          description: 'Hızlı yarış oyunu. En hızlı pilot sen misin?',
          category: 'Racing',
          tags: ['racing', 'speed', 'cars'],
          url: 'https://example.com/speed-racing',
          thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format&q=80',
          featured: true,
          playCount: 3200
        },
        {
          title: 'Space Shooter Galaxy',
          description: 'Uzay savaş oyunu. Galaksiyi düşmanlardan kurtar!',
          category: 'Action',
          tags: ['action', 'space', 'shooter'],
          url: 'https://example.com/space-shooter',
          thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 2100
        },
        {
          title: 'Football Manager 2024',
          description: 'Futbol yönetim oyunu. Takımını şampiyonluğa taşı!',
          category: 'Sports',
          tags: ['sports', 'football', 'management'],
          url: 'https://example.com/football-manager',
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop&auto=format&q=80',
          featured: true,
          playCount: 2900
        },
        {
          title: 'Medieval Strategy',
          description: 'Ortaçağ strateji oyunu. İmparatorluğunu kur!',
          category: 'Strategy',
          tags: ['strategy', 'medieval', 'war'],
          url: 'https://example.com/medieval-strategy',
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 1600
        },
        {
          title: 'Zombie Survival',
          description: 'Zombi hayatta kalma oyunu. Apocalypse\'te hayatta kal!',
          category: 'Action',
          tags: ['action', 'zombie', 'survival'],
          url: 'https://example.com/zombie-survival',
          thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop&auto=format&q=80',
          featured: true,
          playCount: 3500
        },
        {
          title: 'Magic Card Battle',
          description: 'Büyülü kart oyunu. Rakiplerini yenebilir misin?',
          category: 'Card',
          tags: ['card', 'magic', 'strategy'],
          url: 'https://example.com/magic-cards',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 1400
        },
        {
          title: 'Ninja Warrior',
          description: 'Ninja savaşçısı ol! Düşmanları yen ve gizli teknikleri öğren.',
          category: 'Action',
          tags: ['action', 'ninja', 'fighting'],
          url: 'https://example.com/ninja-warrior',
          thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 2200
        },
        {
          title: 'City Builder Deluxe',
          description: 'Kendi şehrini inşa et! Vatandaşları mutlu et ve ekonomiyi yönet.',
          category: 'Simulation',
          tags: ['simulation', 'city', 'building'],
          url: 'https://example.com/city-builder',
          thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&auto=format&q=80',
          featured: true,
          playCount: 2800
        },
        {
          title: 'Ocean Explorer',
          description: 'Denizlerin derinliklerini keşfet! Hazineler bul ve canavarlarla savaş.',
          category: 'Adventure',
          tags: ['adventure', 'ocean', 'exploration'],
          url: 'https://example.com/ocean-explorer',
          thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 1900
        },
        {
          title: 'Basketball Championship',
          description: 'Basketbol şampiyonu ol! En iyi takımları yen ve kupayı kazan.',
          category: 'Sports',
          tags: ['sports', 'basketball', 'championship'],
          url: 'https://example.com/basketball-championship',
          thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop&auto=format&q=80',
          featured: false,
          playCount: 2600
        }
      ];

      // Wizard data'yı öncelikle kullan, fallback olarak örnek verileri ekle
      const allGames = gamesFromWizard.length > 0 ? gamesFromWizard : fallbackGames;

      // Verileri veritabanına ekle
      const insertedGames = await Game.insertMany(allGames);

      res.json({
        success: true,
        message: `Seed data inserted successfully from ${gamesFromWizard.length > 0 ? 'Wizard_Data.json' : 'fallback data'}!`,
        insertedCount: insertedGames.length,
        source: gamesFromWizard.length > 0 ? 'Wizard_Data.json' : 'fallback',
        games: insertedGames.slice(0, 5).map(game => ({
          id: game._id,
          title: game.title,
          category: game.category,
          featured: game.featured,
          thumbnail: game.thumbnail
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Oyun görselleri için endpoint
  app.get('/api/games/:id/image', async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      const thumbnail = (game.Assets && game.Assets[0]) || game.thumbnail || game.image;
      if (thumbnail) {
        res.redirect(thumbnail);
      } else {
        // Fallback görsel
        res.redirect('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format&q=80');
      }
    } catch (error) {
      res.redirect('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop&auto=format&q=80');
    }
  });

  // Oyun oynama sayfası için endpoint
  app.get('/api/games/:id/play', async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (game && (game['Game URL'] || game.url)) {
        const gameURL = game['Game URL'] || game.url;
        res.json({
          success: true,
          gameURL: gameURL,
          title: game.Title || game.title,
          width: game.Width || 800,
          height: game.Height || 600
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Game URL not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Debug endpoint - Gerçek veri yapısını göster
  app.get('/debug/games-structure', async (req, res) => {
    try {
      const games = await Game.find({}).limit(3);
      res.json({
        totalGames: await Game.countDocuments(),
        sampleGames: games.map(game => ({
          id: game._id,
          title: game.title,
          rawData: game.toObject() // Tüm alanları göster
        }))
      });
    } catch (error) {
      res.json({
        error: error.message,
        message: 'Error fetching games structure'
      });
    }
  });

  // MongoDB bağlantısı - Gerçek oyun veritabanı
  try {
    const mongoURI = 'mongodb://localhost:27017/games';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully to games database');

    const gameCount = await Game.countDocuments();
    console.log(`📊 Found ${gameCount} games in database`);

    if (gameCount === 0) {
      console.log('⚠️ No games found! Database might be empty or connection issue.');
    } else if (gameCount < 1000) {
      console.log('⚠️ Low game count. Expected 5400+ games.');
    } else {
      console.log('✅ Good! Found expected number of games.');
    }
  } catch (error) {
    console.log('⚠️ MongoDB connection failed:', error.message);
    console.log('📝 Using sample data as fallback');
  }

  const PORT = 4000;

  httpServer.listen(PORT, async () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
    console.log(`🎮 Manyak Oyunlar API is running!`);
  });
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
