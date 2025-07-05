const { MongoClient } = require('mongodb');

async function testMongoDBConnection() {
  // MongoDB bağlantı URI'si
  const uri = "mongodb://localhost:27017/manyakoyun-connection";
  const client = new MongoClient(uri);
  
  try {
    console.log("MongoDB bağlantısı deneniyor...");
    await client.connect();
    console.log("MongoDB'ye başarıyla bağlandı!");
    
    // Veritabanı ve koleksiyonları listele
    const db = client.db('manyakoyun-connection');
    console.log("manyakoyun-connection veritabanına bağlandı");
    
    // Koleksiyonları listele
    const collections = await db.listCollections().toArray();
    console.log("Mevcut koleksiyonlar:");
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // games koleksiyonunu kontrol et
    if (collections.some(c => c.name === 'games')) {
      const count = await db.collection('games').countDocuments();
      console.log(`'games' koleksiyonunda ${count} oyun var`);
      
      if (count > 0) {
        // Örnek bir oyun getir
        const sampleGame = await db.collection('games').findOne();
        console.log("Örnek oyun:", JSON.stringify(sampleGame, null, 2).substring(0, 500) + "...");
      }
    } else {
      console.log("'games' koleksiyonu bulunamadı!");
    }
    
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
  } finally {
    await client.close();
    console.log("MongoDB bağlantısı kapatıldı");
  }
}

// MongoDB bağlantı testini çalıştır
testMongoDBConnection().catch(console.error);