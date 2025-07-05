import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import RelatedGames from '@/components/RelatedGames'

interface GamePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  // Gerçek uygulamada burada API'dan oyun verisi alınır
  const game = {
    title: 'Örnek Oyun',
    description: 'Bu bir örnek oyun açıklamasıdır.'
  }
  
  return {
    title: `${game.title} - Oyun Merkezi`,
    description: game.description,
  }
}

export default function GamePage({ params }: GamePageProps) {
  const { id } = params
  
  // Gerçek uygulamada burada API'dan oyun verisi alınır
  const game = {
    id,
    title: 'Örnek Oyun',
    description: 'Bu bir örnek oyun açıklamasıdır. Oyun hakkında daha fazla bilgi burada yer alacaktır.',
    imageUrl: 'https://via.placeholder.com/800x450',
    gameUrl: 'https://example.com/game',
    category: ['Aksiyon', 'Macera']
  }
  
  if (!game) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Ana Sayfaya Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{game.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {game.category.map((cat) => (
              <span key={cat} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                {cat}
              </span>
            ))}
          </div>
          
          <div className="aspect-video w-full relative overflow-hidden rounded-lg border">
            <iframe
              src={game.gameUrl}
              className="absolute inset-0 w-full h-full"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={game.title}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Oyun Hakkında</h2>
            <p className="text-muted-foreground">{game.description}</p>
          </div>
          
          <div className="flex gap-4">
            <Button>Tam Ekran Oyna</Button>
            <Button variant="outline">Favorilere Ekle</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Benzer Oyunlar</h2>
          <RelatedGames currentGameId={id} />
        </div>
      </div>
    </div>
  )
} 