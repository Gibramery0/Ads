"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const CATEGORIES = [
  { id: "all", name: "Tüm Oyunlar", icon: "🎮" },
  { id: "action", name: "Aksiyon", icon: "⚡" },
  { id: "adventure", name: "Macera", icon: "🏝️" },
  { id: "puzzle", name: "Bulmaca", icon: "🧩" },
  { id: "racing", name: "Yarış", icon: "🏎️" },
  { id: "strategy", name: "Strateji", icon: "♟️" },
  { id: "sports", name: "Spor", icon: "⚽" },
  { id: "io", name: ".IO Oyunları", icon: "🌐" },
  { id: "shooting", name: "Nişancılık", icon: "🎯" },
  { id: "arcade", name: "Arcade", icon: "👾" },
  { id: "simulation", name: "Simülasyon", icon: "🎛️" },
  { id: "multiplayer", name: "Çok Oyunculu", icon: "👥" },
]

export default function CategoryFilter() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"
  
  const visibleCategories = isExpanded ? CATEGORIES : CATEGORIES.slice(0, 6)
  
  return (
    <div className="bg-card rounded-lg p-4 border">
      <h2 className="font-semibold mb-3">Kategoriler</h2>
      
      <div className="space-y-1">
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            href={category.id === "all" ? "/" : `/games?category=${category.id}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
              currentCategory === category.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
      
      {CATEGORIES.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-center text-sm text-primary hover:underline mt-2 pt-2 border-t"
        >
          {isExpanded ? "Daha Az Göster" : "Daha Fazla Göster"}
        </button>
      )}
    </div>
  )
} 