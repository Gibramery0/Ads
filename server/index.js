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

// Game schema matching the database structure
const GameSchema = new mongoose.Schema({
  Id: Number,
  Title: String,
  Developer: String,
  Description: String,
  'Sub Type': String,
  'Game URL': String,
  'GD URL': String,
  Genres: [String],
  Tags: [String],
  Assets: [String],
  Instructions: String,
  'Key Features': String,
  'Mobile Ready': [String],
  'Is Exclusive': String,
  Gender: [String],
  'Age Group': [String],
  'No Blood': String,
  'No Cruelty': String,
  'Kids Friendly': String,
  Width: Number,
  Height: Number
});

const Game = mongoose.model('Game', GameSchema);

// GraphQL schema matching frontend expectations
const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Game {
    id: ID!
    title: String!
    description: String!
    category: String!
    tags: [String!]!
    url: String!
    thumbnail: String!
    featured: Boolean!
    rating: Float
    playCount: Int!
    createdAt: String!
    updatedAt: String!
    developer: String
    gameUrl: String
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    gameCount: Int!
    games: [Game!]!
  }

  type GameStats {
    totalGames: Int!
    totalPlays: Int!
    popularCategories: [Category!]!
    featuredGames: [Game!]!
  }

  input GameFilter {
    category: String
    tags: [String!]
    featured: Boolean
    search: String
  }

  type Query {
    games(filter: GameFilter, limit: Int = 20, offset: Int = 0): [Game!]!
    game(id: ID!): Game
    gamesByCategory(category: String!, limit: Int = 20): [Game!]!
    searchGames(query: String!, limit: Int = 20): [Game!]!
    featuredGames(limit: Int = 10): [Game!]!
    popularGames(limit: Int = 10): [Game!]!
    categories: [Category!]!
    category(slug: String!): Category
    gameStats: GameStats!
    testConnection: String!
  }

  type Mutation {
    incrementPlayCount(gameId: ID!): Game!
  }
`;

// Helper function to transform database game to GraphQL format
function transformGame(game) {
  return {
    id: game._id.toString(),
    title: game.Title || 'Untitled Game',
    description: game.Description || 'Harika bir oyun!',
    category: (game.Genres && game.Genres[0]) || 'Casual',
    tags: game.Tags || [],
    url: game['Game URL'] || '#',
    gameUrl: game['Game URL'] || '#',
    thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
    featured: Math.random() > 0.7, // Random featured status
    rating: Math.random() * 5,
    playCount: Math.floor(Math.random() * 5000),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    developer: game.Developer || 'Unknown'
  };
}

const resolvers = {
  Query: {
    games: async (_, { filter, limit = 20, offset = 0 }) => {
      try {
        console.log('🎮 Fetching games...');
        const games = await Game.find({}).skip(offset).limit(limit);
        console.log(`✅ Found ${games.length} games`);
        return games.map(transformGame);
      } catch (error) {
        console.error('❌ Games query error:', error);
        throw new Error(`Failed to fetch games: ${error.message}`);
      }
    },

    game: async (_, { id }) => {
      try {
        const game = await Game.findById(id);
        return game ? transformGame(game) : null;
      } catch (error) {
        throw new Error(`Failed to fetch game: ${error.message}`);
      }
    },

    featuredGames: async (_, { limit = 10 }) => {
      try {
        console.log('🌟 Fetching featured games...');
        const games = await Game.find({}).limit(limit);
        console.log(`✅ Found ${games.length} featured games`);
        return games.map(transformGame);
      } catch (error) {
        console.error('❌ Featured games error:', error);
        throw new Error(`Failed to fetch featured games: ${error.message}`);
      }
    },

    popularGames: async (_, { limit = 10 }) => {
      try {
        console.log('🔥 Fetching popular games...');
        const games = await Game.find({}).limit(limit);
        console.log(`✅ Found ${games.length} popular games`);
        return games.map(transformGame);
      } catch (error) {
        console.error('❌ Popular games error:', error);
        throw new Error(`Failed to fetch popular games: ${error.message}`);
      }
    },

    gamesByCategory: async (_, { category, limit = 20 }) => {
      try {
        const games = await Game.find({ 
          Genres: { $in: [category] } 
        }).limit(limit);
        return games.map(transformGame);
      } catch (error) {
        throw new Error(`Failed to fetch games by category: ${error.message}`);
      }
    },

    searchGames: async (_, { query, limit = 20 }) => {
      try {
        const games = await Game.find({
          $or: [
            { Title: { $regex: query, $options: 'i' } },
            { Description: { $regex: query, $options: 'i' } },
            { Tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }).limit(limit);
        return games.map(transformGame);
      } catch (error) {
        throw new Error(`Failed to search games: ${error.message}`);
      }
    },

    categories: async () => {
      try {
        // Get unique genres from games
        const genres = await Game.distinct('Genres');
        return genres.filter(Boolean).map((genre, index) => ({
          id: index.toString(),
          name: genre,
          slug: genre.toLowerCase().replace(/\s+/g, '-'),
          description: `${genre} oyunları`,
          gameCount: 0,
          games: []
        }));
      } catch (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }
    },

    category: async (_, { slug }) => {
      try {
        const name = slug.replace(/-/g, ' ');
        const games = await Game.find({ 
          Genres: { $regex: name, $options: 'i' } 
        });
        return {
          id: '1',
          name: name,
          slug: slug,
          description: `${name} oyunları`,
          gameCount: games.length,
          games: games.map(transformGame)
        };
      } catch (error) {
        throw new Error(`Failed to fetch category: ${error.message}`);
      }
    },

    gameStats: async () => {
      try {
        const totalGames = await Game.countDocuments();
        const featuredGames = await Game.find({}).limit(5);
        
        return {
          totalGames,
          totalPlays: 0,
          popularCategories: [],
          featuredGames: featuredGames.map(transformGame)
        };
      } catch (error) {
        throw new Error(`Failed to fetch game stats: ${error.message}`);
      }
    },

    testConnection: async () => {
      try {
        const count = await Game.countDocuments();
        return `Database connected! Found ${count} games.`;
      } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
      }
    }
  },

  Mutation: {
    incrementPlayCount: async (_, { gameId }) => {
      try {
        // Since we don't have playCount in the original schema, just return the game
        const game = await Game.findById(gameId);
        return game ? transformGame(game) : null;
      } catch (error) {
        throw new Error(`Failed to increment play count: ${error.message}`);
      }
    }
  }
};

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-connection';

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');

    // Test the connection
    const count = await Game.countDocuments();
    console.log(`📊 Total games in database: ${count}`);

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.github.com"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }));

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Apply GraphQL middleware
  app.use('/graphql',
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Connect to database
  await connectDB();

  // Sunucuyu başlat
const PORT = process.env.PORT || 4002;

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 Health check at http://localhost:${PORT}/health`);
  console.log(`🎮 Manyak Oyunlar API is running!`);
});
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-connection';

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');

    // Test the connection
    const count = await Game.countDocuments();
    console.log(`📊 Total games in database: ${count}`);

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.github.com"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }));

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Apply GraphQL middleware
  app.use('/graphql',
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Connect to database
  await connectDB();

  const PORT = process.env.SERVER_PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 Health check at http://localhost:${PORT}/health`);
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
