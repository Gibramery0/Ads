const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB bağlantı bilgileri - .env dosyasından alınır veya varsayılan değerler kullanılır
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamesDB';
const DB_NAME = process.env.DB_NAME || 'gamesDB';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'games';

// JSON dosya yolu - test-data.json, duzenli_veri.json veya Wizard_Data.json dosyalarını kullanabilirsiniz
const JSON_FILE_PATH = path.join(__dirname, 'test-data.json');

// MongoDB'ye veri yükle
async function importDataToMongoDB() {
    let client;
    
    try {
        console.log('MongoDB veritabanına bağlanılıyor...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('MongoDB veritabanına başarıyla bağlandı');
        
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Mevcut koleksiyonu temizle
        console.log(`Mevcut ${COLLECTION_NAME} koleksiyonu temizleniyor...`);
        await collection.deleteMany({});
        
        // JSON dosyasını oku
        console.log(`${JSON_FILE_PATH} dosyasından veriler okunuyor...`);
        const jsonData = JSON.parse(fs.readFileSync(JSON_FILE_PATH, 'utf8'));
        
        // Veri formatını kontrol et ve oyun verilerini çıkar
        let games = [];
        
        if (jsonData.segments && Array.isArray(jsonData.segments)) {
            console.log('Segments formatı tespit edildi');
            jsonData.segments.forEach(segment => {
                if (segment.hits && Array.isArray(segment.hits)) {
                    games = games.concat(segment.hits);
                }
            });
        } else if (jsonData.Games && Array.isArray(jsonData.Games)) {
            console.log('Wizard_Data formatı tespit edildi');
            games = jsonData.Games;
        } else if (Array.isArray(jsonData)) {
            console.log('Düzenli veri formatı tespit edildi');
            games = jsonData;
        } else {
            throw new Error('Bilinmeyen JSON formatı');
        }
        
        if (games.length === 0) {
            throw new Error('Oyun verisi bulunamadı');
        }
        
        console.log(`Toplam ${games.length} oyun verisi bulundu`);
        
        // Veriyi MongoDB'ye ekle
        console.log('Veriler MongoDB\'ye yükleniyor...');
        const result = await collection.insertMany(games);
        
        console.log(`${result.insertedCount} oyun başarıyla MongoDB'ye yüklendi`);
        
        // İndeksleri oluştur (arama performansı için)
        console.log('İndeksler oluşturuluyor...');
        await collection.createIndex({ Title: 1 });
        await collection.createIndex({ Description: "text" });
        await collection.createIndex({ Developer: 1 });
        await collection.createIndex({ Genres: 1 });
        await collection.createIndex({ Tags: 1 });
        await collection.createIndex({ "Mobile Ready": 1 });
        await collection.createIndex({ "Age Group": 1 });
        await collection.createIndex({ Gender: 1 });
        
        console.log('İndeksler başarıyla oluşturuldu');
        console.log('Veri yükleme işlemi tamamlandı!');
        
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB bağlantısı kapatıldı');
        }
    }
}

// Veri yükleme işlemini başlat
importDataToMongoDB(); 