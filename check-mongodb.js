const { MongoClient } = require('mongodb');

async function checkMongoDB() {
  try {
    // Bağlantı URI'si
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    
    // Bağlantıyı aç
    await client.connect();
    console.log("MongoDB'ye bağlandı!");
    
    // Tüm veritabanlarını listele
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    
    console.log("Mevcut veritabanları:");
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // manyakoyun-connection veritabanını kontrol et
    if (dbs.databases.some(db => db.name === 'manyakoyun-connection')) {
      console.log("\nmanyakoyun-connection veritabanı bulundu!");
      
      const db = client.db('manyakoyun-connection');
      const collections = await db.listCollections().toArray();
      
      console.log("Koleksiyonlar:");
      collections.forEach(coll => {
        console.log(`- ${coll.name}`);
      });
      
      // games koleksiyonunu kontrol et
      if (collections.some(c => c.name === 'games')) {
        const count = await db.collection('games').countDocuments();
        console.log(`\n'games' koleksiyonunda ${count} oyun var`);
      } else {
        console.log("\n'games' koleksiyonu bulunamadı!");
      }
    } else {
      console.log("\nmanyakoyun-connection veritabanı bulunamadı!");
    }
    
    await client.close();
  } catch (error) {
    console.error("Hata:", error);
  }
}

checkMongoDB();