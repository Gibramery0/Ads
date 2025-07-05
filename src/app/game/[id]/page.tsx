"use client"

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Share2, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import AdSpace from '@/components/AdSpace'
import GamesGrid from '@/components/GamesGrid'

// Oyun verisi için tip tanımı
interface GameData {
  Title?: string
  title?: string
  Developer?: string
  developer?: string
  Genres?: string[]
  category?: string
  'Game URL'?: string
  url?: string
  Assets?: string[]
  thumbnail?: string
  Description?: string
  description?: string
  Instructions?: string
  Tags?: string[]
  tags?: string[]
  playCount?: number
  Width?: number
  width?: number
  Height?: number
  height?: number
  'Sub Type'?: string
  'Mobile Ready'?: string
}

// Kategori oyunları için tip tanımı
interface CategoryGame {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  developer?: string;
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.id as string
  const [isPlaying, setIsPlaying] = useState(false)
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [hideHeader, setHideHeader] = useState(false)
  const lastScrollY = useRef(0)
  
  // Kategori oyunları için state
  const [categoryGames, setCategoryGames] = useState<CategoryGame[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  // Oynanma sayısı için sabit değer
  const playCount = useRef<number>(0);

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Aşağı kaydırma durumunda header'ı gizle, yukarı kaydırma durumunda göster
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideHeader(true)
      } else {
        setHideHeader(false)
      }
      
      lastScrollY.current = currentScrollY
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // REST API ile oyun verilerini getir
  useEffect(() => {
    async function fetchGame() {
      try {
        setLoading(true)
        const response = await fetch(`/api/games/${gameId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const gameData = await response.json()
        setGame(gameData)
        // Oynanma sayısını bir kere oluştur ve sakla
        playCount.current = gameData.playCount || Math.floor(Math.random() * 5000);
        setError(null)
      } catch (err: any) {
        console.error('Error fetching game:', err)
        setError(err.message || 'Oyun yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchGame()
    }
  }, [gameId])

  // Oyunun kategorisine göre benzer oyunları getir
  useEffect(() => {
    if (!game) return;
    
    const category = (game.Genres && game.Genres[0]) || game.category;
    if (!category) return;
    
    async function fetchCategoryGames() {
      try {
        setCategoryLoading(true);
        const response = await fetch(`/api/games?category=${category}&limit=12&page=1`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Mevcut oyunu listeden çıkar
        const filteredGames = data.games
          .filter((g: any) => g._id !== gameId)
          .map((g: any) => ({
            id: g._id,
            title: g.Title || g.title,
            thumbnail: (g.Assets && g.Assets[0]) || g.thumbnail || 'https://via.placeholder.com/300x200',
            category: (g.Genres && g.Genres[0]) || g.category || 'Genel',
            developer: g.Developer || g.developer
          }));
        
        setCategoryGames(filteredGames);
        setHasMore(data.hasMore);
        setPage(1);
      } catch (error) {
        console.error('Kategori oyunları yüklenirken hata oluştu:', error);
      } finally {
        setCategoryLoading(false);
      }
    }
    
    fetchCategoryGames();
  }, [game, gameId]);

  // Daha fazla kategori oyunu yükle
  const loadMoreCategoryGames = async () => {
    if (!game || categoryLoading) return;
    
    const category = (game.Genres && game.Genres[0]) || game.category;
    if (!category) return;
    
    try {
      setCategoryLoading(true);
      const nextPage = page + 1;
      const response = await fetch(`/api/games?category=${category}&limit=12&page=${nextPage}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mevcut oyunu listeden çıkar
      const filteredGames = data.games
        .filter((g: any) => g._id !== gameId)
        .map((g: any) => ({
          id: g._id,
          title: g.Title || g.title,
          thumbnail: (g.Assets && g.Assets[0]) || g.thumbnail || 'https://via.placeholder.com/300x200',
          category: (g.Genres && g.Genres[0]) || g.category || 'Genel',
          developer: g.Developer || g.developer
        }));
      
      setCategoryGames(prev => [...prev, ...filteredGames]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Daha fazla kategori oyunu yüklenirken hata oluştu:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  // Ekran boyutlarının çarpımını hesapla
  const calculateScreenArea = () => {
    if (!game) return '';
    
    const width = game.Width || game.width || 0;
    const height = game.Height || game.height || 0;
    
    if (width && height) {
      return `>${(width * height).toLocaleString()}`;
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Oyun Bulunamadı</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'Aradığınız oyun mevcut değil veya kaldırılmış olabilir.'}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePlayGame = () => {
    setIsPlaying(true)
    // TODO: Play count'u artırmak için API çağrısı eklenebilir
  }

  const handleShareGame = () => {
    // Mevcut URL'yi kopyala
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsLinkCopied(true);
      // 2 saniye sonra eski haline dön
      setTimeout(() => {
        setIsLinkCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Bağlantı kopyalanamadı:', err);
    });
  };

  const gameCategory = (game.Genres && game.Genres[0]) || game.category || 'Genel';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`sticky top-0 z-10 bg-background/95 backdrop-blur transition-transform duration-300 border-b ${hideHeader ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="h-8 px-2 py-1">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="ml-1 text-xs">Geri</span>
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-lg md:text-xl font-bold leading-tight">{game.Title || game.title}</h1>
              <p className="text-muted-foreground text-xs">
                {game.Developer || game.developer} • {gameCategory}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Ads */}
      <div className="container mx-auto px-2 pt-4">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          {/* Sol Reklam Alanı */}
          <div className="hidden xl:block xl:col-span-2">
            <div className="sticky top-4">
              <AdSpace
                slot="left-sidebar"
                format="skyscraper"
                className="w-full h-[600px] mx-auto"
              />
            </div>
          </div>

          {/* Ana Oyun Alanı */}
          <div className="xl:col-span-8">
            {/* Oyun Container */}
            <div className="relative">
              {isPlaying ? (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={game['Game URL'] || game.url || ''}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                      title={(game.Title || game.title || 'Oyun').toString()}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
                  <Image
                    src={(game.Assets && game.Assets[0]) || game.thumbnail || 'https://via.placeholder.com/800x450'}
                    alt={(game.Title || game.title || 'Oyun').toString()}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="lg"
                      onClick={handlePlayGame}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="mr-2 h-6 w-6" />
                      Oyunu Başlat
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Oyun Altı Reklam */}
            <div className="mt-4">
              <AdSpace
                slot="below-game"
                format="leaderboard"
                className="w-full"
              />
            </div>

            {/* Oyun Bilgileri */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                {/* Sol - Açıklama */}
                <div className="bg-card p-4 rounded-lg border h-full">
                  <h2 className="text-xl font-semibold mb-3">Oyun Hakkında</h2>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {game.Description || game.description || 'Bu oyun hakkında açıklama bulunmuyor.'}
                  </p>

                  {/* Instructions */}
                  {game.Instructions && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2 text-sm">Nasıl Oynanır</h3>
                      <p className="text-xs text-muted-foreground">
                        {game.Instructions}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {((game.Tags && game.Tags.length > 0) || (game.tags && game.tags.length > 0)) && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2 text-sm">Etiketler</h3>
                      <div className="flex flex-wrap gap-2">
                        {(game.Tags || game.tags || []).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sağ - Oyun İstatistikleri */}
                <div className="bg-card p-4 rounded-lg border h-full">
                  <h3 className="font-semibold mb-4">Oyun Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kategori:</span>
                      <span className="font-medium">{gameCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Geliştirici:</span>
                      <span className="font-medium">{game.Developer || game.developer || 'Bilinmiyor'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Oynama Sayısı:</span>
                      <span className="font-medium">{calculateScreenArea() || playCount.current.toLocaleString()}</span>
                    </div>
                    {game['Mobile Ready'] && game['Mobile Ready'].length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mobil:</span>
                        <span className="font-medium">✓ Uyumlu</span>
                      </div>
                    )}
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="space-y-2 mt-4">
                    <Button className="w-full" onClick={handlePlayGame}>
                      <Play className="mr-2 h-4 w-4" />
                      Oyunu Oyna
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleShareGame}
                      disabled={isLinkCopied}
                    >
                      {isLinkCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Bağlantı Kopyalandı
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Paylaş
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Benzer Oyunlar - Kategori Oyunları */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Benzer Oyunlar - {gameCategory}</h2>
              <GamesGrid 
                games={categoryGames} 
                loading={categoryLoading} 
                hasMore={hasMore}
                onLoadMore={loadMoreCategoryGames}
              />
            </div>
          </div>

          {/* Sağ Reklam Alanı */}
          <div className="hidden xl:block xl:col-span-2">
            <div className="sticky top-4">
              <AdSpace
                slot="right-sidebar"
                format="skyscraper"
                className="w-full h-[600px] mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
