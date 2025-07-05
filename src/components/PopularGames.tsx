"use client"

import { useQuery } from '@apollo/client';
import { GET_POPULAR_GAMES } from '@/lib/graphql/queries';
import { GameCard } from "./GameCard"

// Örnek veri - gerçek uygulamada API'dan gelecek
const DUMMY_POPULAR_GAMES = [
  {
    id: "2",
    title: "Macera Adası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Macera", "Keşif"],
  },
  {
    id: "6",
    title: "Strateji Savaşları",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Strateji", "Savaş"],
  },
  {
    id: "4",
    title: "Futbol Şampiyonası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Spor", "Simülasyon"],
  },
  {
    id: "8",
    title: "Kart Düellosu",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Kart", "Strateji"],
  },
];

export default function PopularGames() {
  const { data, loading, error } = useQuery(GET_POPULAR_GAMES, {
    variables: { limit: 4 }
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-square bg-muted animate-pulse rounded-md" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Popüler oyunlar yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  const games = data?.popularGames || DUMMY_POPULAR_GAMES;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          imageUrl={game.thumbnail || game.imageUrl}
          category={Array.isArray(game.category) ? game.category : [game.category]}
        />
      ))}
    </div>
  )
} 