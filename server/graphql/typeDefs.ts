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
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    gameCount: Int!
    games: [Game!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favorites: [Game!]!
    playHistory: [Game!]!
    createdAt: String!
  }

  type GameStats {
    totalGames: Int!
    totalPlays: Int!
    popularCategories: [Category!]!
    featuredGames: [Game!]!
  }

  type TestResult {
    totalGames: Int!
    sampleGame: String!
    database: String!
    collection: String!
  }

  input GameInput {
    title: String!
    description: String!
    category: String!
    tags: [String!]!
    url: String!
    thumbnail: String!
    featured: Boolean = false
  }

  input GameFilter {
    category: String
    tags: [String!]
    featured: Boolean
    search: String
  }

  type Query {
    # Games
    games(filter: GameFilter, limit: Int = 20, offset: Int = 0): [Game!]!
    game(id: ID!): Game
    gamesByCategory(category: String!, limit: Int = 20): [Game!]!
    searchGames(query: String!, limit: Int = 20): [Game!]!
    featuredGames(limit: Int = 10): [Game!]!
    popularGames(limit: Int = 10): [Game!]!
    
    # Categories
    categories: [Category!]!
    category(slug: String!): Category
    
    # Stats
    gameStats: GameStats!

    # Test
    testConnection: TestResult!

    # User
    me: User
    userFavorites: [Game!]!
  }

  type Mutation {
    # Games
    addGame(input: GameInput!): Game!
    updateGame(id: ID!, input: GameInput!): Game!
    deleteGame(id: ID!): Boolean!
    incrementPlayCount(gameId: ID!): Game!
    
    # User actions
    addToFavorites(gameId: ID!): Boolean!
    removeFromFavorites(gameId: ID!): Boolean!
    recordPlay(gameId: ID!): Boolean!
    
    # Auth (for admin)
    login(email: String!, password: String!): String!
    register(username: String!, email: String!, password: String!): String!
  }

  type Subscription {
    gameAdded: Game!
    playCountUpdated(gameId: ID!): Game!
  }
`;

module.exports = { typeDefs };
