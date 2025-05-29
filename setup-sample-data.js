const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB bağlantı bilgileri
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'config';
const COLLECTION_NAME = 'games';

// Örnek oyun verileri
const sampleGames = [
    {
        Title: "Pixel Macera",
        Description: "Renkli bir dünyada macera dolu bir yolculuğa çıkın. Engelleri aşın, düşmanları yenin ve hazineleri toplayın.",
        Developer: "Oyun Stüdyo",
        Genres: ["Action", "Adventure"],
        Tags: ["2D", "pixel-art", "platform"],
        GameURL: "https://html5.gamedistribution.com/rvvASMiM/bf1268eec91b483cafc5668b95ed6c07/index.html",
        Image: "https://img.gamedistribution.com/bf1268eec91b483cafc5668b95ed6c07-512x384.jpeg"
    },
    {
        Title: "Araba Yarışı",
        Description: "Hızlı araçlarla nefes kesen yarışlara katılın. Rakiplerinizi geçin ve birinci olun!",
        Developer: "Hız Oyunları",
        Genres: ["Racing", "Sports"],
        Tags: ["3D", "cars", "multiplayer"],
        GameURL: "https://html5.gamedistribution.com/rvvASMiM/f804d079d19f43d9a0efc5c931c24010/index.html",
        Image: "https://img.gamedistribution.com/f804d079d19f43d9a0efc5c931c24010-512x384.jpeg"
    },
    {
        Title: "Bulmaca Adası",
        Description: "Zekânızı zorlayacak bulmacaları çözün ve adanın gizemlerini keşfedin.",
        Developer: "Akıl Oyunları",
        Genres: ["Puzzle", "Adventure"],
        Tags: ["logic", "relaxing", "colorful"],
        GameURL: "https://html5.gamedistribution.com/rvvASMiM/e8c274d5130d45c7be0fd81e738ce525/index.html",
        Image: "https://img.gamedistribution.com/e8c274d5130d45c7be0fd81e738ce525-512x384.jpeg"
    },
    {
        Title: "Uzay Savaşları",
        Description: "Uzay gemilerinizle düşman filosunu alt edin ve galaksiyi kurtarın!",
        Developer: "Galaksi Oyunları",
        Genres: ["Action", "Arcade"],
        Tags: ["space", "shooter", "sci-fi"],
        GameURL: "https://html5.gamedistribution.com/rvvASMiM/4a3f21f1f354419fb7f17f23ab321a52/index.html",
        Image: "https://img.gamedistribution.com/4a3f21f1f354419fb7f17f23ab321a52-512x384.jpeg"
    },
    {
        Title: "Orman Kaşifi",
        Description: "Ormanın derinliklerinde saklı hazineleri bulmak için tehlikeli bir maceraya atılın.",
        Developer: "Macera Stüdyoları",
        Genres: ["Adventure", "RPG"],
        Tags: ["exploration", "survival", "story"],
        GameURL: "https://html5.gamedistribution.com/rvvASMiM/5b0abd4c0faa4f5eb190a9a16d5a1b4c/index.html",
        Image: "https://img.gamedistribution.com/5b0abd4c0faa4f5eb190a9a16d5a1b4c-512x384.jpeg"
    }
];

// MongoDB'ye verileri ekle
async function setupSampleData() {
    let client;
    
    try {
        console.log('MongoDB veritabanına bağlanılıyor...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('MongoDB veritabanına başarıyla bağlandı');
        
        const db = client.db(DB_NAME);
        
        // Koleksiyon var mı kontrol et, yoksa oluştur
        const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
        if (collections.length === 0) {
            console.log(`'${COLLECTION_NAME}' koleksiyonu oluşturuluyor...`);
            await db.createCollection(COLLECTION_NAME);
        }
        
        const collection = db.collection(COLLECTION_NAME);
        
        // Mevcut oyun sayısını kontrol et
        const existingCount = await collection.countDocuments();
        console.log(`Mevcut oyun sayısı: ${existingCount}`);
        
        if (existingCount === 0) {
            // Örnek verileri ekle
            console.log('Örnek oyun verileri ekleniyor...');
            const result = await collection.insertMany(sampleGames);
            console.log(`${result.insertedCount} örnek oyun başarıyla eklendi`);
        } else {
            console.log('Veritabanında zaten oyun verileri var. Ekleme yapılmadı.');
        }
        
        // Veritabanındaki tüm oyunları görüntüle
        const allGames = await collection.find({}).toArray();
        console.log(`Veritabanında toplam ${allGames.length} oyun var`);
        
        console.log('Örnek veri kurulumu tamamlandı!');
        
    } catch (error) {
        console.error('Veri ekleme hatası:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB bağlantısı kapatıldı');
        }
    }
}

// Veri ekleme işlemini başlat
setupSampleData(); 