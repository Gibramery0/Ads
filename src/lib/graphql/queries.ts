import { gql } from '@apollo/client';

// Oyunları getir
export const GET_GAMES = gql`
  query GetGames($limit: Int, $offset: Int) {
    games(limit: $limit, offset: $offset) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      featured
      playCount
      createdAt
    }
  }
`;

// Öne çıkan oyunları getir
export const GET_FEATURED_GAMES = gql`
  query GetFeaturedGames($limit: Int) {
    featuredGames(limit: $limit) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      playCount
      createdAt
    }
  }
`;

// Popüler oyunları getir
export const GET_POPULAR_GAMES = gql`
  query GetPopularGames($limit: Int) {
    popularGames(limit: $limit) {
      id
      title
      description
      category
      thumbnail
      gameUrl
      playCount
      createdAt
    }
  }
`;

// Tek bir oyunu getir
export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      title
      description
      category
      tags
      url
      thumbnail
      featured
      playCount
      developer
      width
      height
    }
  }
`;

// Admin için oyunları getir (daha fazla detay ve filtreleme)
export const GET_ADMIN_GAMES = gql`
  query GetAdminGames($page: Int, $limit: Int, $search: String, $category: String) {
    adminGames(page: $page, limit: $limit, search: $search, category: $category) {
      games {
        id
        title
        description
        category
        developer
        thumbnail
        gameUrl
        featured
        playCount
        createdAt
      }
      totalCount
      pageCount
    }
  }
`;

// Oyun kategorilerini getir
export const GET_GAME_CATEGORIES = gql`
  query GetGameCategories {
    gameCategories
  }
`;

// Oyun istatistiklerini getir
export const GET_GAMES_STATS = gql`
  query GetGamesStats {
    gamesStats {
      totalGames
      totalPlays
      totalUsers
      featuredGames
      popularCategories {
        name
        count
      }
    }
  }
`;
