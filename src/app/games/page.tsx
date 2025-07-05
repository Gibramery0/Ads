"use client"

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_GAMES } from '@/lib/graphql/queries';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

export default function AllGamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLimit, setCurrentLimit] = useState(50);

  const { data, loading, error, fetchMore } = useQuery(GET_GAMES, {
    variables: { limit: currentLimit },
    notifyOnNetworkStatusChange: true
  });

  const loadMore = () => {
    setCurrentLimit(prev => prev + 50);
  };

  const filteredGames = data?.games?.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.developer?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hata Oluştu</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tüm Oyunlar</h1>
        <p className="text-muted-foreground mb-6">
          {data?.games?.length || 0} oyun bulundu (Toplam 5400+ oyun)
        </p>

        {/* Arama */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Oyun ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && currentLimit === 50 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 aspect-video rounded-lg mb-2"></div>
              <div className="bg-gray-300 h-4 rounded mb-1"></div>
              <div className="bg-gray-300 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Oyun Listesi */}
      {!loading || currentLimit > 50 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                imageUrl={game.thumbnail}
                category={[game.category]}
                aspectRatio="video"
              />
            ))}
          </div>

          {/* Load More Button */}
          {data?.games && data.games.length >= currentLimit && (
            <div className="text-center">
              <Button 
                onClick={loadMore}
                disabled={loading}
                size="lg"
              >
                {loading ? 'Yükleniyor...' : 'Daha Fazla Oyun Yükle'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {data.games.length} / 5400+ oyun gösteriliyor
              </p>
            </div>
          )}

          {/* Arama Sonucu Boş */}
          {searchTerm && filteredGames.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Oyun Bulunamadı</h3>
              <p className="text-muted-foreground">
                "{searchTerm}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
              </p>
            </div>
          )}
        </>
      ) : null}

      {/* İstatistikler */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border text-center">
          <h3 className="text-2xl font-bold text-primary">{data?.games?.length || 0}</h3>
          <p className="text-muted-foreground">Yüklenen Oyun</p>
        </div>
        <div className="bg-card p-6 rounded-lg border text-center">
          <h3 className="text-2xl font-bold text-primary">5400+</h3>
          <p className="text-muted-foreground">Toplam Oyun</p>
        </div>
        <div className="bg-card p-6 rounded-lg border text-center">
          <h3 className="text-2xl font-bold text-primary">{filteredGames.length}</h3>
          <p className="text-muted-foreground">Filtrelenmiş Sonuç</p>
        </div>
      </div>
    </div>
  );
}
