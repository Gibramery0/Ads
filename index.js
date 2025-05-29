const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB bağlantısı için değişkenler
let db;
const uri = process.env.MONGODB_URI;

// JSON dosyasından verileri yükle (MongoDB bağlantısı olmadığında kullanılacak)
let gameData;
try {
  const dataPath = path.join(__dirname, 'test-data.json');
  const rawData = fs.readFileSync(dataPath);
  gameData = JSON.parse(rawData);
  console.log('JSON verileri başarıyla yüklendi');
} catch (error) {
  console.error('JSON dosyası yüklenirken hata oluştu:', error);
  gameData = { segments: [] };
}

// API endpoint'leri
// Tüm oyunları getir
app.get('/api/oyunlar', (req, res) => {
  try {
    // Eğer MongoDB bağlantısı varsa oradan getir
    if (db) {
      db.collection('oyunlar').find().toArray()
        .then(oyunlar => {
          res.json(oyunlar);
        })
        .catch(err => {
          console.error('MongoDB sorgusunda hata:', err);
          res.status(500).json({ hata: 'Veritabanı hatası' });
        });
    } else {
      // MongoDB bağlantısı yoksa JSON dosyasından getir
      const oyunlar = [];
      
      // Test-data.json yapısında oyunlar "segments" -> "hits" dizisinde
      if (gameData && gameData.segments && gameData.segments.length > 0) {
        gameData.segments.forEach(segment => {
          if (segment.hits && Array.isArray(segment.hits)) {
            segment.hits.forEach(game => {
              oyunlar.push(game);
            });
          }
        });
      }
      
      res.json(oyunlar);
    }
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
});

// Belirli bir oyunu ID'ye göre getir
app.get('/api/oyunlar/:id', (req, res) => {
  const { id } = req.params;
  try {
    if (db) {
      db.collection('oyunlar').findOne({ Id: id })
        .then(oyun => {
          if (!oyun) {
            return res.status(404).json({ hata: 'Oyun bulunamadı' });
          }
          res.json(oyun);
        })
        .catch(err => {
          console.error('MongoDB sorgusunda hata:', err);
          res.status(500).json({ hata: 'Veritabanı hatası' });
        });
    } else {
      // JSON dosyasından ID'ye göre oyun ara
      let bulunanOyun = null;
      
      if (gameData && gameData.segments) {
        gameData.segments.forEach(segment => {
          if (segment.hits && Array.isArray(segment.hits)) {
            const oyun = segment.hits.find(g => g.Id === id);
            if (oyun) bulunanOyun = oyun;
          }
        });
      }
      
      if (bulunanOyun) {
        res.json(bulunanOyun);
      } else {
        res.status(404).json({ hata: 'Oyun bulunamadı' });
      }
    }
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
});

// Oyunları türe göre getir
app.get('/api/oyunlar/tur/:tur', (req, res) => {
  const { tur } = req.params;
  try {
    if (db) {
      db.collection('oyunlar').find({ Genres: tur }).toArray()
        .then(oyunlar => {
          res.json(oyunlar);
        })
        .catch(err => {
          console.error('MongoDB sorgusunda hata:', err);
          res.status(500).json({ hata: 'Veritabanı hatası' });
        });
    } else {
      // JSON dosyasından türe göre oyunları getir
      const oyunlar = [];
      
      if (gameData && gameData.segments) {
        gameData.segments.forEach(segment => {
          if (segment.hits && Array.isArray(segment.hits)) {
            segment.hits.forEach(game => {
              if (game.Genres && game.Genres.includes(tur)) {
                oyunlar.push(game);
              }
            });
          }
        });
      }
      
      res.json(oyunlar);
    }
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
});

// MongoDB bağlantısını dene
async function connectToMongoDB() {
  if (!uri) {
    console.log('MongoDB bağlantı URI\'si bulunamadı, yerel JSON verisi kullanılacak');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('MongoDB\'ye bağlandı');
    
    db = client.db('oyunVeritabani');
    
    // Koleksiyon yoksa oluştur ve verileri yükle
    const collections = await db.listCollections({ name: 'oyunlar' }).toArray();
    if (collections.length === 0) {
      console.log('Oyunlar koleksiyonu oluşturuluyor ve veriler yükleniyor...');
      
      const oyunlar = [];
      if (gameData && gameData.segments) {
        gameData.segments.forEach(segment => {
          if (segment.hits && Array.isArray(segment.hits)) {
            segment.hits.forEach(game => {
              oyunlar.push(game);
            });
          }
        });
      }
      
      if (oyunlar.length > 0) {
        await db.collection('oyunlar').insertMany(oyunlar);
        console.log(`${oyunlar.length} oyun başarıyla veritabanına yüklendi`);
      }
    }
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    console.log('Yerel JSON verileri kullanılacak');
    db = null;
  }
}

// MongoDB bağlantı testi
async function testMongoDBConnection() {
  const uri = "mongodb://localhost:27017/oyunVeritabani";
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
          }
        }
      }
    } catch (error) {
      console.error('JSON verileri işlenirken hata oluştu:', error);
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

// Ana sayfayı göster
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Oyun Bilgi Portalı</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .endpoints {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .endpoint {
            margin-bottom: 10px;
          }
          a {
            color: #0066cc;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Oyun Bilgi Portalı API</h1>
        <p>Bu API, oyun bilgilerini görüntülemek için kullanılabilir.</p>
        
        <div class="endpoints">
          <h2>Kullanılabilir Endpoint'ler:</h2>
          <div class="endpoint">
            <a href="/api/oyunlar">/api/oyunlar</a> - Tüm oyunları listeler
          </div>
          <div class="endpoint">
            <a href="/api/oyunlar/1234567890">/api/oyunlar/{id}</a> - Belirli bir oyunu ID'ye göre getirir
          </div>
          <div class="endpoint">
            <a href="/api/oyunlar/tur/Arcade">/api/oyunlar/tur/{tur}</a> - Oyunları türe göre filtreler
          </div>
        </div>
      </body>
    </html>
  `);
});

// Sunucuyu başlat
app.listen(PORT, async () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
  await connectToMongoDB();
}); 