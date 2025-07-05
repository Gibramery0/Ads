'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchGames } from '@/lib/api';
import GamesGrid from '@/components/GamesGrid';

interface Game {
  id?: string;
  _id?: string;
  Id?: string;
  title?: string;
  Title?: string;
  thumbnail?: string;
  Assets?: string[];
  category?: string;
  Genres?: string[];
  description?: string;
  Description?: string;
}

export default function SearchPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Oyunları yükle
  const loadGames = useCallback(async (pageNum: number, append: boolean = false) => {
    if (!searchQuery) {
      setGames([]);
      setLoading(false);
      return;
    }

    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      
      const limit = 100;
      // API'ye arama sorgusu ekleyerek çağır
      const response = await fetchGames(limit, pageNum, undefined, searchQuery);
      
      // API yanıtı doğru formatta mı kontrol et
      let newGames: Game[] = [];
      
      if (response.games && Array.isArray(response.games)) {
        newGames = response.games;
        if (response.total) {
          setTotalGames(response.total);
        }
      } else if (Array.isArray(response)) {
        newGames = response;
      } else {
        console.error('Unexpected API response format:', response);
        setError('API yanıt formatı beklenmedik şekilde');
        return;
      }
      
      // Oyun sayısı limit'ten azsa, daha fazla oyun olmadığını belirt
      if (newGames.length < limit) {
        setHasMore(false);
      }
      
      // Yeni oyunları ekle veya tüm oyunları değiştir
      if (append) {
        setGames(prevGames => [...prevGames, ...newGames]);
      } else {
        setGames(newGames);
      }
    } catch (err: any) {
      console.error('Error loading games:', err);
      setError('Oyunlar yüklenirken bir hata oluştu: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Daha fazla oyun yükle
  const loadMoreGames = useCallback(() => {
    if (loading || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    loadGames(nextPage, true);
  }, [loading, hasMore, page, loadGames]);

  // İlk yükleme
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadGames(1, false);
  }, [searchQuery, loadGames]);

  // Oyunları normalize et
  const normalizedGames = games.map(game => ({
    id: game.id || game._id || game.Id || '',
    title: game.title || game.Title || 'İsimsiz Oyun',
    thumbnail: game.thumbnail || (game.Assets && game.Assets[0]) || 'https://via.placeholder.com/300x200',
    category: game.category || (game.Genres && game.Genres[0]) || 'Genel'
  }));

  // Hata durumunu göster
  if (error) {
    return <div className="container mx-auto text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-2 pl-2 pr-1">
      <h1 className="text-2xl font-bold mb-2 pl-2">
        {searchQuery ? `"${searchQuery}" için arama sonuçları` : 'Arama'}
        <span className="text-sm font-normal text-muted-foreground ml-2">
          {totalGames > 0 ? `(${totalGames} sonuç)` : `(${normalizedGames.length} sonuç)`}
        </span>
      </h1>

      {searchQuery ? (
        loading && normalizedGames.length === 0 ? (
          <div className="text-center py-10">Arama sonuçları yükleniyor...</div>
        ) : normalizedGames.length === 0 ? (
          <div className="text-center py-10">
            <p>"{searchQuery}" için sonuç bulunamadı.</p>
            <p className="text-muted-foreground mt-2">Farklı anahtar kelimeler deneyebilir veya daha genel bir arama yapabilirsiniz.</p>
          </div>
        ) : (
          <GamesGrid 
            games={normalizedGames} 
            loading={loading} 
            hasMore={hasMore}
            onLoadMore={loadMoreGames}
          />
        )
      ) : (
        <div className="text-center py-10">
          <p>Arama yapmak için yukarıdaki arama kutusunu kullanın.</p>
        </div>
      )}
    </div>
  );
} 