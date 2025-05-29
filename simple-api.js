const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// JSON verileri yükle
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

// Tüm oyunları hazırla
function getAllGames() {
  const oyunlar = [];
  
  if (gameData && gameData.segments && gameData.segments.length > 0) {
    gameData.segments.forEach(segment => {
      if (segment.hits && Array.isArray(segment.hits)) {
        segment.hits.forEach(game => {
          oyunlar.push(game);
        });
      }
    });
  }
  
  return oyunlar;
}

// API endpoint'leri
// Ana sayfa
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Oyun API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #ff6b9d;
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
            color: #ff6b9d;
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

// Tüm oyunları getir
app.get('/api/oyunlar', (req, res) => {
  try {
    const oyunlar = getAllGames();
    res.json(oyunlar);
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
});

// Belirli bir oyunu ID'ye göre getir
app.get('/api/oyunlar/:id', (req, res) => {
  const { id } = req.params;
  try {
    const oyunlar = getAllGames();
    const bulunanOyun = oyunlar.find(game => game.Id === id);
    
    if (bulunanOyun) {
      res.json(bulunanOyun);
    } else {
      res.status(404).json({ hata: 'Oyun bulunamadı' });
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
    const oyunlar = getAllGames();
    const filtrelenmisOyunlar = oyunlar.filter(game => 
      game.Genres && game.Genres.includes(tur)
    );
    
    res.json(filtrelenmisOyunlar);
  } catch (error) {
    console.error('Veri getirme hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 