import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameCard } from "./GameCard";

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  developer?: string;
}

interface GamesGridProps {
  games: Game[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function GamesGrid({ 
  games, 
  loading = false, 
  hasMore = false, 
  onLoadMore 
}: GamesGridProps) {
  const [initialLoad, setInitialLoad] = useState(loading);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sonsuz kaydırma için IntersectionObserver kullanımı
  const lastGameElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    // Önceki observer'ı temizle
    if (observer.current) observer.current.disconnect();
    
    // Yeni observer oluştur
    observer.current = new IntersectionObserver(entries => {
      // Eğer son eleman görünür hale geldiyse ve daha fazla yüklenecek oyun varsa
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    }, {
      rootMargin: '100px' // Eleman görünmeden 100px önce tetiklensin
    });
    
    // Eğer bir node varsa, onu gözlemle
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  // Component unmount olduğunda observer'ı temizle
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // İlk yükleme tamamlandığında initialLoad'u false yap
  useEffect(() => {
    if (!loading && initialLoad) {
      setInitialLoad(false);
    }
  }, [loading]);

  // İlk yükleme durumu
  if (initialLoad) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 pl-2 pr-0 py-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-video bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }

  // Oyun bulunamadı durumu
  if (!games || games.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Bu kategoride oyun bulunamadı.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 pl-2 pr-0 py-1">
        {games.map((game, index) => (
          <div 
            key={game.id} 
            ref={index === games.length - 1 ? lastGameElementRef : undefined}
          >
            <GameCard
              id={game.id}
              title={game.title}
              imageUrl={game.thumbnail}
              category={[game.category]}
              aspectRatio="video"
              className="h-full w-full transition-transform hover:scale-[1.02] duration-200"
            />
          </div>
        ))}
      </div>
      
      {/* Yükleme göstergesi */}
      {loading && !initialLoad && (
        <div className="flex justify-center items-center py-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Yükleme tetikleyicisi */}
      <div ref={loadMoreRef} className="h-1 w-full"></div>
    </>
  );
} 