import mongoose from 'mongoose'
import dbConnect from './db'
import Game from './models/Game'

const sampleGames = [
  {
    title: 'Araba Yarışı',
    slug: 'araba-yarisi',
    description: 'Heyecan verici bir araba yarışı oyunu. Rakiplerinizi geçin ve birinci olun!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/araba-yarisi',
    category: ['Yarış', 'Aksiyon'],
    featured: true,
    popular: true,
  },
  {
    title: 'Macera Adası',
    slug: 'macera-adasi',
    description: 'Gizemli bir adada maceraya atılın. Hazineleri keşfedin ve bulmacaları çözün!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/macera-adasi',
    category: ['Macera', 'Keşif'],
    featured: false,
    popular: true,
  },
  {
    title: 'Bulmaca Ustası',
    slug: 'bulmaca-ustasi',
    description: 'Zekânızı test eden bulmacalar. Her seviye daha da zorlaşır!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/bulmaca-ustasi',
    category: ['Bulmaca', 'Zeka'],
    featured: true,
    popular: false,
  },
  {
    title: 'Futbol Şampiyonası',
    slug: 'futbol-sampiyonasi',
    description: 'Takımınızı şampiyonluğa taşıyın! Gerçekçi futbol simülasyonu.',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/futbol-sampiyonasi',
    category: ['Spor', 'Simülasyon'],
    featured: false,
    popular: true,
  },
  {
    title: 'Uzay Macerası',
    slug: 'uzay-macerasi',
    description: 'Uzayın derinliklerinde bir macera. Gezegenleri keşfedin ve uzaylılarla savaşın!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/uzay-macerasi',
    category: ['Macera', 'Bilim Kurgu'],
    featured: true,
    popular: false,
  },
  {
    title: 'Strateji Savaşları',
    slug: 'strateji-savaslari',
    description: 'Ordunuzu yönetin ve düşmanlarınızı stratejik hamlelerle yenin!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/strateji-savaslari',
    category: ['Strateji', 'Savaş'],
    featured: false,
    popular: true,
  },
  {
    title: 'Zombi Saldırısı',
    slug: 'zombi-saldirisi',
    description: 'Zombi kıyametinde hayatta kalın. Silahlarınızı toplayın ve savaşın!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/zombi-saldirisi',
    category: ['Aksiyon', 'Korku'],
    featured: true,
    popular: false,
  },
  {
    title: 'Kart Düellosu',
    slug: 'kart-duellosu',
    description: 'Stratejik kart oyunu. Desteni oluştur ve rakiplerini yen!',
    imageUrl: 'https://via.placeholder.com/800x450',
    thumbnailUrl: 'https://via.placeholder.com/300x300',
    gameUrl: 'https://example.com/games/kart-duellosu',
    category: ['Kart', 'Strateji'],
    featured: false,
    popular: true,
  },
];

async function seedDatabase() {
  try {
    await dbConnect();
    
    // Mevcut oyunları temizle
    await Game.deleteMany({});
    console.log('Mevcut oyunlar silindi');
    
    // Yeni oyunları ekle
    await Game.insertMany(sampleGames);
    console.log('Örnek oyunlar eklendi');
    
    console.log('Veritabanı başarıyla dolduruldu');
  } catch (error) {
    console.error('Veritabanı doldurma hatası:', error);
  } finally {
    // Bağlantıyı kapat
    await mongoose.disconnect();
  }
}

// Bu dosya doğrudan çalıştırılırsa seed işlemini başlat
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed işlemi tamamlandı');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed işlemi başarısız:', error);
      process.exit(1);
    });
}

export default seedDatabase; 