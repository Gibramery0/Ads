const { Game } = require('../models/Game');
const { Category } = require('../models/Category');
const { User } = require('../models/User');

const resolvers = {
  Query: {
    games: async (_, { limit = 20, offset = 0 }) => {
      try {
        console.log('🎮 Fetching games with limit:', limit, 'offset:', offset);
        const games = await Game.find({}).skip(offset).limit(limit);
        console.log(`✅ Found ${games.length} games`);
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || 'Untitled Game',
          description: game.Description || '',
          category: (game.Genres && game.Genres[0]) || 'Casual',
          tags: game.Tags || [],
          url: game['Game URL'] || '#',
          thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || 0,
          developer: game.Developer || 'Unknown',
          width: game.Width || 800,
          height: game.Height || 600,
          instructions: game.Instructions || ''
        }));
      } catch (error) {
        console.error('❌ Games query error:', error);
        throw new Error(`Failed to fetch games: ${error}`);
      }
    },

    game: async (_, { id }) => {
      try {
        console.log(`🎮 Fetching game with id: ${id}`);
        const game = await Game.findById(id);
        
        if (!game) {
          console.log(`❌ Game not found with id: ${id}`);
          return null;
        }
        
        console.log(`✅ Found game: ${game.Title}`);
        return {
          id: game._id.toString(),
          title: game.Title || 'Untitled Game',
          description: game.Description || '',
          category: (game.Genres && game.Genres[0]) || 'Casual',
          tags: game.Tags || [],
          url: game['Game URL'] || '#',
          thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || 0,
          developer: game.Developer || 'Unknown',
          width: game.Width || 800,
          height: game.Height || 600,
          instructions: game.Instructions || ''
        };
      } catch (error) {
        console.error(`❌ Game query error for id ${id}:`, error);
        throw new Error(`Failed to fetch game: ${error}`);
      }
    },

    gamesByCategory: async (_: any, { category, limit }: any) => {
      try {
        return await Game.find({ category })
          .sort({ playCount: -1 })
          .limit(limit);
      } catch (error) {
        throw new Error(`Failed to fetch games by category: ${error}`);
      }
    },

    searchGames: async (_: any, { query, limit }: any) => {
      try {
        return await Game.find({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }).limit(limit);
      } catch (error) {
        throw new Error(`Failed to search games: ${error}`);
      }
    },

    featuredGames: async (_, { limit = 6 }) => {
      try {
        console.log('🌟 Fetching featured games...');
        const games = await Game.find({ featured: true }).limit(limit);
        if (games.length === 0) {
          // Eğer featured oyun yoksa, rastgele oyunları featured olarak işaretle
          const randomGames = await Game.find({}).limit(limit);
          return randomGames.map(game => ({
            id: game._id.toString(),
            title: game.Title || 'Untitled Game',
            description: game.Description || '',
            category: (game.Genres && game.Genres[0]) || 'Casual',
            tags: game.Tags || [],
            url: game['Game URL'] || '#',
            thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
            featured: true,
            playCount: game.playCount || 0,
            developer: game.Developer || 'Unknown'
          }));
        }
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || 'Untitled Game',
          description: game.Description || '',
          category: (game.Genres && game.Genres[0]) || 'Casual',
          tags: game.Tags || [],
          url: game['Game URL'] || '#',
          thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || 0,
          developer: game.Developer || 'Unknown'
        }));
      } catch (error) {
        console.error('❌ Featured games error:', error);
        throw new Error(`Failed to fetch featured games: ${error}`);
      }
    },

    popularGames: async (_, { limit = 8 }) => {
      try {
        console.log('🔥 Fetching popular games...');
        const games = await Game.find({}).sort({ playCount: -1 }).limit(limit);
        return games.map(game => ({
          id: game._id.toString(),
          title: game.Title || 'Untitled Game',
          description: game.Description || '',
          category: (game.Genres && game.Genres[0]) || 'Casual',
          tags: game.Tags || [],
          url: game['Game URL'] || '#',
          thumbnail: (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
          featured: game.featured || false,
          playCount: game.playCount || 0,
          developer: game.Developer || 'Unknown'
        }));
      } catch (error) {
        console.error('❌ Popular games error:', error);
        throw new Error(`Failed to fetch popular games: ${error}`);
      }
    },

    categories: async () => {
      try {
        return await Category.find().sort({ name: 1 });
      } catch (error) {
        throw new Error(`Failed to fetch categories: ${error}`);
      }
    },

    category: async (_: any, { slug }: any) => {
      try {
        return await Category.findOne({ slug });
      } catch (error) {
        throw new Error(`Failed to fetch category: ${error}`);
      }
    },

    gameStats: async () => {
      try {
        const totalGames = await Game.countDocuments();
        console.log(`📊 Total games in database: ${totalGames}`);

        // Test: İlk 5 oyunu getir
        const sampleGames = await Game.find().limit(5);
        console.log(`🎮 Sample games:`, sampleGames.map(g => ({ id: g.Id, title: g.Title })));

        return {
          totalGames,
          totalPlays: 0,
          popularCategories: [],
          featuredGames: []
        };
      } catch (error) {
        console.error('❌ GameStats error:', error);
        throw new Error(`Failed to fetch game stats: ${error}`);
      }
    },

    // Test query - oyun sayısını kontrol et
    testConnection: async () => {
      try {
        const count = await Game.countDocuments();
        const sample = await Game.findOne();
        console.log(`🔍 Database test - Total: ${count}, Sample:`, sample?.Title);
        return {
          totalGames: count,
          sampleGame: sample?.Title || 'No games found',
          database: 'games',
          collection: 'games'
        };
      } catch (error) {
        console.error('❌ Test connection error:', error);
        throw new Error(`Test failed: ${error}`);
      }
    }
  },

  Mutation: {
    addGame: async (_: any, { input }: any) => {
      try {
        const game = new Game(input);
        return await game.save();
      } catch (error) {
        throw new Error(`Failed to add game: ${error}`);
      }
    },

    updateGame: async (_: any, { id, input }: any) => {
      try {
        return await Game.findByIdAndUpdate(id, input, { new: true });
      } catch (error) {
        throw new Error(`Failed to update game: ${error}`);
      }
    },

    deleteGame: async (_: any, { id }: any) => {
      try {
        await Game.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error(`Failed to delete game: ${error}`);
      }
    },

    incrementPlayCount: async (_: any, { gameId }: any) => {
      try {
        return await Game.findByIdAndUpdate(
          gameId,
          { $inc: { playCount: 1 } },
          { new: true }
        );
      } catch (error) {
        throw new Error(`Failed to increment play count: ${error}`);
      }
    }
  },

  Category: {
    games: async (parent: any) => {
      return await Game.find({ category: parent.name });
    },
    gameCount: async (parent: any) => {
      return await Game.countDocuments({ category: parent.name });
    }
  }
};

module.exports = { resolvers };
