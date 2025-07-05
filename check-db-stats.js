const { MongoClient } = require('mongodb');

async function checkDatabaseStats() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('MongoDB bağlantısı başarılı!');
    
    const db = client.db('games');
    const collection = db.collection('games');
    
    // Toplam oyun sayısı
    const totalGames = await collection.countDocuments();
    console.log(`\n📊 Toplam oyun sayısı: ${totalGames}`);
    
    // Kategorileri kontrol et
    console.log('\n🎮 Kategoriler ve oyun sayıları:');
    const categories = await collection.aggregate([
      {
        $group: {
          _id: {
            $cond: {
              if: { $isArray: "$Genres" },
              then: { $arrayElemAt: ["$Genres", 0] },
              else: "$Genres"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      }
    ]).toArray();
    
    categories.forEach((cat, index) => {
      const categoryName = cat._id || 'Kategori Yok';
      console.log(`${index + 1}. ${categoryName}: ${cat.count} oyun`);
    });
    
    // Örnek oyun bilgileri
    console.log('\n🎯 Örnek oyun bilgileri:');
    const sampleGames = await collection.find({}).limit(3).toArray();
    sampleGames.forEach((game, index) => {
      console.log(`\n${index + 1}. Oyun:`);
      console.log(`   Başlık: ${game.Title}`);
      console.log(`   Geliştirici: ${game.Developer}`);
      console.log(`   Kategori: ${game.Genres ? (Array.isArray(game.Genres) ? game.Genres.join(', ') : game.Genres) : 'Yok'}`);
      console.log(`   Etiketler: ${game.Tags ? (Array.isArray(game.Tags) ? game.Tags.slice(0, 3).join(', ') : game.Tags) : 'Yok'}`);
      console.log(`   Mobil: ${game['Mobile Ready'] ? game['Mobile Ready'].join(', ') : 'Yok'}`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await client.close();
  }
}

checkDatabaseStats();
