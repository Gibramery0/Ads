const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB bağlantı bilgileri - setup-sample-data.js dosyasında başarılı olan yapılandırma
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'config';  // setup-sample-data.js dosyasındaki gibi
const COLLECTION_NAME = 'games';  // setup-sample-data.js dosyasındaki gibi

// CORS middleware ekle
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// JSON işleme
app.use(express.json());

// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Oyun detay sayfası
app.get('/game/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// MongoDB bağlantı işlevi
async function connectToMongoDB() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('MongoDB veritabanına başarıyla bağlandı');
        return client;
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        throw error;
    }
}

// API endpoint - Tüm oyunları getir
app.get('/api/games', async (req, res) => {
    let client;
    try {
        // MongoDB'ye bağlan
        client = await connectToMongoDB();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Tüm oyunları getir
        const games = await collection.find({}).toArray();
        console.log(`${games.length} oyun verisi bulundu`);

        // ID alanlarını düzenle
        const processedGames = games.map(game => {
            // MongoDB _id'sini string olarak ekleyelim
            if (game._id) {
                game.Id = game._id.toString();
            }
            return game;
        });

        // Başarılı yanıt döndür
        return res.status(200).json(processedGames);
    } catch (error) {
        console.error('MongoDB hatası:', error);
        return res.status(500).json({ 
            error: 'Veritabanı hatası', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        // Bağlantıyı kapat
        if (client) {
            await client.close();
            console.log('MongoDB bağlantısı kapatıldı');
        }
    }
});

// ID'ye göre oyun getir
app.get('/api/games/:id', async (req, res) => {
    let client;
    try {
        const { id } = req.params;
        
        // MongoDB'ye bağlan
        client = await connectToMongoDB();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Oyunu ID'ye göre bul
        let game;
        
        // Önce doğrudan string ID ile arama yap
        game = await collection.findOne({ Id: id });
        
        // Eğer bulunamadıysa, MongoDB ObjectId ile dene
        if (!game) {
            try {
                const objectId = new ObjectId(id);
                game = await collection.findOne({ _id: objectId });
            } catch (err) {
                console.log('ObjectId dönüşüm hatası, geçersiz ID formatı');
            }
        }
        
        if (!game) {
            return res.status(404).json({ 
                error: 'Oyun bulunamadı', 
                message: `"${id}" ID'li oyun veritabanında bulunamadı` 
            });
        }
        
        // ID'yi string olarak ekle
        if (game._id) {
            game.Id = game._id.toString();
        }
        
        return res.status(200).json(game);
    } catch (error) {
        console.error('Oyun detayları getirilirken hata:', error);
        return res.status(500).json({ 
            error: 'Veritabanı hatası', 
            message: error.message 
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// Kategori bazlı oyunları getir
app.get('/api/games/category/:category', async (req, res) => {
    let client;
    try {
        const { category } = req.params;
        
        // MongoDB'ye bağlan
        client = await connectToMongoDB();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Kategori sorgusunu oluştur - büyük küçük harf duyarsız
        const query = {
            $or: [
                { Genres: { $regex: new RegExp(`^${category}$`, 'i') } },  // Tam eşleşme, büyük/küçük harf duyarsız
                { Tags: { $regex: new RegExp(`^${category}$`, 'i') } },    // Tam eşleşme, büyük/küçük harf duyarsız
                { Category: { $regex: new RegExp(`^${category}$`, 'i') } },
                { Genre: { $regex: new RegExp(`^${category}$`, 'i') } }
            ]
        };
        
        // Kategori bazlı oyunları getir
        const games = await collection.find(query).toArray();
        console.log(`'${category}' kategorisinde ${games.length} oyun bulundu`);
        
        // ID alanlarını düzenle
        const processedGames = games.map(game => {
            if (game._id) {
                game.Id = game._id.toString();
            }
            return game;
        });
        
        return res.status(200).json(processedGames);
    } catch (error) {
        console.error('Kategori verileri getirilirken hata:', error);
        return res.status(500).json({ 
            error: 'Veritabanı hatası', 
            message: error.message 
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// Arama işlevi
app.get('/api/games/search', async (req, res) => {
    let client;
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                error: 'Geçersiz istek', 
                message: 'Arama sorgusu gerekli' 
            });
        }
        
        // MongoDB'ye bağlan
        client = await connectToMongoDB();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Metin araması için regex sorgusu
        const searchQuery = {
            $or: [
                { Title: { $regex: query, $options: 'i' } },
                { Description: { $regex: query, $options: 'i' } },
                { Name: { $regex: query, $options: 'i' } },
                { Developer: { $regex: query, $options: 'i' } }
            ]
        };
        
        // Arama sonuçlarını getir
        const games = await collection.find(searchQuery).toArray();
        console.log(`'${query}' için ${games.length} sonuç bulundu`);
        
        // ID alanlarını düzenle
        const processedGames = games.map(game => {
            if (game._id) {
                game.Id = game._id.toString();
            }
            return game;
        });
        
        return res.status(200).json(processedGames);
    } catch (error) {
        console.error('Arama hatası:', error);
        return res.status(500).json({ 
            error: 'Veritabanı hatası', 
            message: error.message 
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 