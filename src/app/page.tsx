'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchGames } from '@/lib/api';
import CategorySection from '@/components/CategorySection';
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
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  // Oyunları yükle
  const loadGames = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      
      // Kategori seçiliyse daha fazla oyun yükle (50 -> 100)
      const limit = selectedCategory ? 100 : 1000; 
      const response = await fetchGames(limit, pageNum, selectedCategory || undefined);
      console.log('API response:', response);

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
  }, [selectedCategory]);

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
  }, [selectedCategory, loadGames]);

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

  // Eğer belirli bir kategori seçilmişse, sadece o kategorideki oyunları göster
  if (selectedCategory) {
    return (
      <div className="container mx-auto py-2 pl-2 pr-1">
        <h1 className="text-2xl font-bold mb-2 pl-2">
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Kategorisi
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {totalGames > 0 ? `(${totalGames} oyun)` : `(${normalizedGames.length} oyun)`}
          </span>
        </h1>
        <GamesGrid 
          games={normalizedGames} 
          loading={loading} 
          hasMore={hasMore}
          onLoadMore={loadMoreGames}
        />
      </div>
    );
  }

  // İlk yükleme durumunda yükleniyor göster
  if (loading && normalizedGames.length === 0) {
    return (
      <div className="container mx-auto py-2 pl-2 pr-1">
        <div className="text-center py-10">Oyunlar yükleniyor...</div>
      </div>
    );
  }

  // Oyunları kategorilere göre grupla - Her kategoriden maksimum 50 oyun
  const gamesByCategory = normalizedGames.reduce<Record<string, typeof normalizedGames>>((acc, game) => {
    const category = game.category;
    if (!acc[category]) {
      acc[category] = [];
    }

    // Her kategoriden maksimum 50 oyun ekle
    if (acc[category].length < 50) {
      acc[category].push(game);
    }

    return acc;
  }, {});

  // Kategorileri oyun sayısına göre sırala - TÜM kategorileri göster
  const sortedCategories = Object.entries(gamesByCategory)
    .sort(([,a], [,b]) => b.length - a.length)
    .filter(([,games]) => games.length > 0); // Sadece oyunu olan kategorileri göster

  return (
    <div className="container mx-auto py-2 pl-2 pr-1">
      {normalizedGames.length === 0 ? (
        <div className="text-center py-10">
          <p>Hiç oyun bulunamadı. Veritabanı bağlantısını kontrol edin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedCategories.map(([categoryName, categoryGames]) => (
            <CategorySection
              key={categoryName}
              title={categoryName}
              games={categoryGames}
              categorySlug={categoryName.toLowerCase().replace(/\s+/g, '-')}
              icon="🎮"
            />
          ))}
        </div>
      )}
    </div>
  );
}