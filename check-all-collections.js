const { MongoClient } = require('mongodb');

async function checkAllCollections() {
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
    
    console.log("=== TÜM VERİTABANLARI VE KOLEKSİYONLAR ===");
    
    // Her veritabanını kontrol et
    for (const database of dbs.databases) {
      // admin, local ve config veritabanlarını atla
      if (['admin', 'local', 'config'].includes(database.name)) {
        continue;
      }
      
      console.log(`\n📁 VERİTABANI: ${database.name}`);
      
      const db = client.db(database.name);
      const collections = await db.listCollections().toArray();
      
      if (collections.length === 0) {
        console.log("  ℹ️ Bu veritabanında koleksiyon yok");
        continue;
      }
      
      // Her koleksiyonu kontrol et
      for (const collection of collections) {
        try {
          const count = await db.collection(collection.name).countDocuments();
          console.log(`  📋 ${collection.name}: ${count} döküman`);
          
          // Eğer koleksiyonda veri varsa, örnek bir döküman göster
          if (count > 0) {
            const sampleDoc = await db.collection(collection.name).findOne();
            console.log(`    🔍 Örnek döküman alanları: ${Object.keys(sampleDoc).join(', ')}`);
          }
        } catch (err) {
          console.log(`  ❌ ${collection.name}: Hata - ${err.message}`);
        }
      }
    }
    
    await client.close();
    console.log("\n✅ MongoDB bağlantısı kapatıldı");
  } catch (error) {
    console.error("❌ Hata:", error);
  }
}

checkAllCollections();