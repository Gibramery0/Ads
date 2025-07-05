"use client"

import React from "react"
import { GameCard } from "./GameCard"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useLazyLoad } from "@/hooks/useLazyLoad"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"

interface Game {
  id: string
  title: string
  thumbnail: string
  category: string
  developer?: string
}

interface CategoryGridProps {
  title: string
  games: Game[]
  categorySlug?: string
}

function CategoryGrid({ title, games, categorySlug }: CategoryGridProps) {
  // Debug log
  console.log(`CategoryGrid rendered for "${title}" with ${games.length} games`);

  const {
    visibleItems: displayedGames,
    hasMore: hasMoreGames,
    loadMore: loadMoreGames,
    isLoading,
    totalCount,
    visibleCount
  } = useLazyLoad({
    items: games,
    initialCount: 48, // İlk yüklemede daha fazla oyun
    loadMoreCount: 24  // Her seferinde 24 oyun daha
  })

  // Infinite scroll için
  const { loadingRef } = useInfiniteScroll({
    hasMore: hasMoreGames,
    isLoading,
    onLoadMore: loadMoreGames,
    threshold: 0.2
  })

  if (!games || games.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground">Bu kategoride henüz oyun bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="category-grid px-4">
      {/* Section Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">
          {visibleCount} / {totalCount} oyun gösteriliyor
        </p>
      </div>

      {/* Games Grid - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-3 sm:gap-4 mb-8">
        {displayedGames.map((game) => (
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

      {/* Infinite Scroll Trigger */}
      {hasMoreGames && (
        <div ref={loadingRef} className="text-center mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <span className="text-muted-foreground">Daha fazla oyun yükleniyor...</span>
            </div>
          ) : (
            <Button
              onClick={loadMoreGames}
              size="lg"
              variant="outline"
              className="min-w-[200px]"
            >
              Daha Fazla Göster ({totalCount - visibleCount} kaldı)
            </Button>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      {totalCount > 48 && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Gösterilen: {visibleCount}</span>
            <span>Toplam: {totalCount}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(visibleCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* End Message */}
      {!hasMoreGames && totalCount > 48 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            🎉 Tüm {totalCount} oyun yüklendi!
          </p>
        </div>
      )}
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CategoryGrid, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.categorySlug === nextProps.categorySlug &&
    prevProps.games.length === nextProps.games.length &&
    prevProps.games === nextProps.games
  );
});
