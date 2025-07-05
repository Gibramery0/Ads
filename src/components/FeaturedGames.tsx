"use client"

import { useQuery } from '@apollo/client';
import { GET_FEATURED_GAMES } from '@/lib/graphql/queries';
import { GameCard } from "./GameCard"

// Örnek veri - gerçek uygulamada API'dan gelecek
const DUMMY_FEATURED_GAMES = [
  {
    id: "1",
    title: "Araba Yarışı",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Yarış", "Aksiyon"],
  },
  {
    id: "5",
    title: "Uzay Macerası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Macera", "Bilim Kurgu"],
  },
  {
    id: "7",
    title: "Zombi Saldırısı",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Aksiyon", "Korku"],
  },
  {
    id: "3",
    title: "Bulmaca Ustası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Bulmaca", "Zeka"],
  },
];

export default function FeaturedGames() {
  const { data, loading, error } = useQuery(GET_FEATURED_GAMES, {
    variables: { limit: 4 }
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-video bg-muted animate-pulse rounded-md" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Oyunlar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  const games = data?.featuredGames || DUMMY_FEATURED_GAMES;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          imageUrl={game.thumbnail || game.imageUrl}
          category={Array.isArray(game.category) ? game.category : [game.category]}
          aspectRatio="video"
        />
      ))}
    </div>
  )
} 