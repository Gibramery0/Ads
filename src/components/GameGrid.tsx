"use client"

import { useState, useEffect } from "react"
import { GameCard } from "./GameCard"

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
  {
    id: "5",
    title: "Uzay Macerası",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Macera", "Bilim Kurgu"],
  },
  {
    id: "6",
    title: "Strateji Savaşları",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Strateji", "Savaş"],
  },
  {
    id: "7",
    title: "Zombi Saldırısı",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Aksiyon", "Korku"],
  },
  {
    id: "8",
    title: "Kart Düellosu",
    imageUrl: "https://via.placeholder.com/300x300",
    category: ["Kart", "Strateji"],
  },
];

export default function GameGrid() {
  const [games, setGames] = useState(DUMMY_GAMES)
  const [isLoading, setIsLoading] = useState(true)

  // Gerçek uygulamada API'dan veri çekme
  useEffect(() => {
    // API çağrısı simülasyonu
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-square bg-muted animate-pulse rounded-md" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded-md w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard
          key={game.id}
          id={game.id}
          title={game.title}
          imageUrl={game.imageUrl}
          category={game.category}
        />
      ))}
    </div>
  )
} 