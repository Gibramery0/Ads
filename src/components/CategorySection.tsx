"use client"

import React, { useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { GameCard } from "./GameCard"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface Game {
  id: string
  title: string
  thumbnail: string
  category: string
  developer?: string
}

interface CategorySectionProps {
  title: string
  games: Game[]
  categorySlug?: string
  icon?: string
}

export default function CategorySection({ title, games, categorySlug, icon }: CategorySectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Responsive games per page
  const getGamesPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 6 // lg: 6 columns
      if (window.innerWidth >= 768) return 4  // md: 4 columns
      return 2 // sm: 2 columns
    }
    return 6 // default
  }

  const [gamesPerPage, setGamesPerPage] = useState(6) // Default value
  const totalPages = Math.ceil(games.length / gamesPerPage)

  // Window resize listener
  React.useEffect(() => {
    // Set initial value after mount
    setGamesPerPage(getGamesPerPage())

    const handleResize = () => {
      setGamesPerPage(getGamesPerPage())
      setCurrentPage(0) // Reset to first page on resize
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentGames = games.slice(
    currentPage * gamesPerPage,
    (currentPage + 1) * gamesPerPage
  )

  const goToPrevPage = () => {
    if (currentPage > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(pageIndex)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }

  const canGoPrev = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  if (!games || games.length === 0) {
    return null
  }

  return (
    <section className="category-section mb-2 pl-2 pr-1 group">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          {categorySlug && (
            <Link
              href={`/?category=${encodeURIComponent(title)}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Tümünü Gör
            </Link>
          )}
        </div>
      </div>

      {/* Games Grid with Pagination */}
      <div className="relative">
        {/* Left Navigation Button */}
        {canGoPrev && (
          <div className="absolute left-0 top-0 bottom-0 w-12 z-20 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity duration-300">
            <button
              onClick={goToPrevPage}
              className="scroll-nav-button w-full h-full bg-background/50 border-r border-border hover:bg-background/80 flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Right Navigation Button */}
        {canGoNext && (
          <div className="absolute right-0 top-0 bottom-0 w-12 z-20 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity duration-300">
            <button
              onClick={goToNextPage}
              className="scroll-nav-button w-full h-full bg-background/50 border-l border-border hover:bg-background/80 flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
          {currentGames.map((game) => (
            <div
              key={game.id}
              className="w-full"
            >
              <GameCard
                id={game.id}
                title={game.title}
                imageUrl={game.thumbnail}
                category={[game.category]}
                aspectRatio="video"
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Sayfa Göstergesi */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-1 gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  index === currentPage
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
