"use client"

import { useState, useEffect } from "react"
import { GameCard } from "./GameCard"

interface RelatedGamesProps {
  currentGameId: string
}

// Örnek veri - gerçek uygulamada API'dan gelecek
const DUMMY_GAMES = [
  {
    id: "1",
    title: "Araba Yarışı",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Yarış", "Aksiyon"],
  },
  {
    id: "2",
    title: "Macera Adası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Macera", "Keşif"],
  },
  {
    id: "3",
    title: "Bulmaca Ustası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Bulmaca", "Zeka"],
  },
  {
    id: "4",
    title: "Futbol Şampiyonası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Spor", "Simülasyon"],
  },
];

export default function RelatedGames({ currentGameId }: RelatedGamesProps) {
  const [games, setGames] = useState<typeof DUMMY_GAMES>([])
  const [isLoading, setIsLoading] = useState(true)

  // Gerçek uygulamada API'dan veri çekme
  useEffect(() => {
    // API çağrısı simülasyonu
    setTimeout(() => {
      // Mevcut oyunu filtrele
      const filteredGames = DUMMY_GAMES.filter(game => game.id !== currentGameId)
      // En fazla 3 oyun göster
      setGames(filteredGames.slice(0, 3))
      setIsLoading(false)
    }, 500)
  }, [currentGameId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div className="w-16 h-16 bg-muted animate-pulse rounded-md" />
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded-md w-24" />
              <div className="h-3 bg-muted animate-pulse rounded-md w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        İlgili oyun bulunamadı.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game.id} className="flex gap-3 items-center">
          <div className="w-16 h-16 relative rounded-md overflow-hidden">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm line-clamp-1">{game.title}</h3>
            <p className="text-xs text-muted-foreground">
              {game.category[0]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 