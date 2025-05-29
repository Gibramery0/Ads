# Oyun Merkezi - MongoDB Entegrasyonu

Bu proje, JSON dosyaları yerine MongoDB veritabanını kullanan bir oyun portalı uygulamasıdır.

## Kurulum

1. MongoDB 8.0'ı bilgisayarınıza kurun veya bir MongoDB Atlas hesabı oluşturun.
2. Proje dizininde aşağıdaki komutu çalıştırarak gerekli paketleri yükleyin:

```bash
npm install
```

3. `.env` dosyasını oluşturun ve MongoDB bağlantı bilgilerinizi ayarlayın:

```
MONGODB_URI=mongodb://localhost:27017/gamesDB
DB_NAME=gamesDB
COLLECTION_NAME=games
PORT=3000
```

4. MongoDB'de `gamesDB` veritabanı ve `games` koleksiyonu oluşturun ve verilerinizi içe aktarın. Verileri manuel olarak MongoDB arayüzünden ekleyebilir veya şu komutu kullanabilirsiniz:

```bash
npm run setup-db
```

## Kullanım

Uygulamayı başlatmak için:

```bash
npm start
```

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.

## Özellikler

- MongoDB 8.0 ile veri depolama ve yönetim
- Kategorilere göre oyun filtreleme
- Gerçek zamanlı arama
- Mobil uyumlu tasarım
- Favorilere ekleme özelliği

## API Endpointleri

- `GET /api/games`: Tüm oyunları getirir
- `GET /api/games/category/:category`: Belirtilen kategorideki oyunları getirir
- `GET /api/games/search?query=arama_terimi`: Oyunları arar

## Veri Yapısı

MongoDB'de saklanan oyun verilerinin temel yapısı:

```json
{
  "_id": {
    "$oid": "6838704e237e18965c49f45f"
  },
  "Id": "a55c9cc9c21e4fc683c8c6857f3d0c75",
  "Title": "Fireboy and Watergirl 1 Forest Temple",
  "Developer": "Agame",
  "Description": "Oyun açıklaması",
  "Sub Type": "Javascript",
  "Game URL": "https://example.com/game",
  "Genres": ["Adventure"],
  "Tags": ["2d", "2players", "logic", "platformer"],
  "Assets": ["https://example.com/image.jpg"],
  "Instructions": "Move with WASD and the arrow keys.",
  "Mobile Ready": ["For IOS", "For Android"],
  "Age Group": ["Kids", "Teens"],
  "Gender": ["Male", "Female"]
}
```

## Notlar

- Sistem ilk kez çalıştırıldığında, `.env` dosyasında belirtilen MongoDB bağlantısı kullanılır.
- `db-setup.js` scripti, JSON dosyasındaki verileri MongoDB'ye aktarır.
- MongoDB 8.0'da, koleksiyondaki her kayıt için otomatik olarak eklenen `_id` alanı kullanılabilir. 