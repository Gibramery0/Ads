const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB bağlantı testi
async function testMongoDBConnection() {
  // Yerel MongoDB bağlantısı için URI
  const uri = "mongodb://localhost:27017/oyunVeritabani";
  
  // Alternatif olarak Atlas bağlantısı için:
  // const uri = "mongodb+srv://<kullanici_adi>:<sifre>@cluster0.mongodb.net/oyunVeritabani";
  
  const client = new MongoClient(uri);
  
  try {
    console.log("MongoDB bağlantısı deneniyor...");
    await client.connect();
    console.log("MongoDB'ye başarıyla bağlandı!");
    
    // Veritabanı ve koleksiyonları listele
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    console.log("Mevcut veritabanları:");
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Veri ekleme ve alma örneği
    const db = client.db('oyunVeritabani');
    
    // Test verisini yükle
    try {
      const dataPath = path.join(__dirname, 'test-data.json');
      const rawData = fs.readFileSync(dataPath);
      const gameData = JSON.parse(rawData);
      console.log('JSON verileri başarıyla yüklendi');
      
      // JSON verilerini MongoDB'ye ekleme
      if (gameData && gameData.segments && gameData.segments.length > 0) {
        const oyunlar = [];
        gameData.segments.forEach(segment => {
          if (segment.hits && Array.isArray(segment.hits)) {
            segment.hits.forEach(game => {
              oyunlar.push(game);
            });
          }
        });
        
        if (oyunlar.length > 0) {
          // Koleksiyon varsa temizle
          try {
            await db.collection('oyunlar').drop();
            console.log('Mevcut oyunlar koleksiyonu temizlendi');
          } catch (err) {
            console.log('Oyunlar koleksiyonu henüz yok, yeni oluşturulacak');
          }
          
          // Oyunları ekle
          const result = await db.collection('oyunlar').insertMany(oyunlar);
          console.log(`${result.insertedCount} oyun başarıyla veritabanına eklendi`);
          
          // Eklenen verileri kontrol et
          const count = await db.collection('oyunlar').countDocuments();
          console.log(`Veritabanında toplam ${count} oyun var`);
          
          // Bir oyunu getir
          if (count > 0) {
            const firstGame = await db.collection('oyunlar').findOne();
            console.log("Örnek oyun:", firstGame.Title);
            
            // Tür bazlı sorgu örneği
            const arcadeGames = await db.collection('oyunlar').find({ Genres: "Arcade" }).toArray();
            console.log(`"Arcade" türündeki oyun sayısı: ${arcadeGames.length}`);
            if (arcadeGames.length > 0) {
              console.log("Arcade oyunları:", arcadeGames.map(game => game.Title));
            }
            
            // Etiket bazlı sorgu örneği
            const testTagGames = await db.collection('oyunlar').find({ Tags: "test" }).toArray();
            console.log(`"test" etiketli oyun sayısı: ${testTagGames.length}`);
            if (testTagGames.length > 0) {
              console.log("Test etiketli oyunlar:", testTagGames.map(game => game.Title));
            }
          }
        }
      }
    } catch (error) {
      console.error('JSON verileri işlenirken hata oluştu:', error);
    }
    
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    console.log("MongoDB bağlantısı kurulamadı. Lütfen şunları kontrol edin:");
    console.log("1. MongoDB sunucusunun çalışıp çalışmadığını");
    console.log("2. Bağlantı URI'sinin doğru olduğunu");
    console.log("3. MongoDB sunucusunun erişilebilir olduğunu");
    console.log("4. Güvenlik duvarı ayarlarınızı");
  } finally {
    await client.close();
    console.log("MongoDB bağlantısı kapatıldı");
  }
}

// MongoDB bağlantı testini çalıştır
testMongoDBConnection().catch(console.error); 