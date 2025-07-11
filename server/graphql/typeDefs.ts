const { gql } = require('apollo-server');

// Rename to avoid duplicate declaration
const graphqlTypeDefs = gql`
  type Game {
    id: ID!
    title: String!
    description: String
    category: String
    tags: [String]
    url: String!
    thumbnail: String
    featured: Boolean
    playCount: Int
    developer: String
    width: Int
    height: Int
    instructions: String
    createdAt: String
    updatedAt: String
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    imageUrl: String
    games: [Game]
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    role: String
    favorites: [Game]
    playHistory: [Game]
    createdAt: String
    updatedAt: String
  }

  type GameStats {
    totalGames: Int!
    totalPlays: Int!
    popularCategories: [Category]
    featuredGames: [Game]
  }

  type TestResult {
    totalGames: Int
    sampleGame: String
    database: String
    collection: String
  }

  type Query {
    games(limit: Int, offset: Int): [Game]
    game(id: ID!): Game
    gamesByCategory(category: String!, limit: Int): [Game]
    searchGames(query: String!, limit: Int): [Game]
    featuredGames(limit: Int): [Game]
    popularGames(limit: Int): [Game]
    
    categories: [Category]
    category(slug: String!): Category
    
    users: [User]
    user(id: ID!): User
    
    gameStats: GameStats
    testConnection: TestResult
  }

  type Mutation {
    createGame(
      title: String!
      description: String
      category: String
      tags: [String]
      url: String!
      thumbnail: String
      featured: Boolean
      developer: String
      width: Int
      height: Int
      instructions: String
    ): Game

    updateGame(
      id: ID!
      title: String
      description: String
      category: String
      tags: [String]
      url: String
      thumbnail: String
      featured: Boolean
      developer: String
      width: Int
      height: Int
      instructions: String
    ): Game

    deleteGame(id: ID!): Boolean
    
    incrementPlayCount(id: ID!): Game
    toggleFeatured(id: ID!): Game
  }
`;

// Export with the new name
module.exports = { typeDefs: graphqlTypeDefs };
