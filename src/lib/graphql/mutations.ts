
import { gql } from '@apollo/client';

// Giriş yap
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// Kayıt ol
export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

// Oyun ekle
export const ADD_GAME = gql`
  mutation AddGame($input: GameInput!) {
    addGame(input: $input) {
      id
      title
      description
      category
      developer
      thumbnail
      gameUrl
      featured
      createdAt
    }
  }
`;

// Oyun güncelle
export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $input: GameInput!) {
    updateGame(id: $id, input: $input) {
      id
      title
      description
      category
      developer
      thumbnail
      gameUrl
      featured
      createdAt
    }
  }
`;

// Oyun sil
export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id)
  }
`;

// Oyunun öne çıkarma durumunu güncelle
export const UPDATE_GAME_FEATURED = gql`
  mutation UpdateGameFeatured($id: ID!, $featured: Boolean!) {
    updateGame(id: $id, input: { featured: $featured }) {
      id
      featured
    }
  }
`;

// Oyun oynama sayısını artır
export const INCREMENT_PLAY_COUNT = gql`
  mutation IncrementPlayCount($gameId: ID!) {
    incrementPlayCount(gameId: $gameId) {
      id
      playCount
    }
  }
`;

// Favorilere ekle
export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($gameId: ID!) {
    addToFavorites(gameId: $gameId)
  }
`;

// Favorilerden çıkar
export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($gameId: ID!) {
    removeFromFavorites(gameId: $gameId)
  }
`;
