# MongoDB Kurulum ve EC2 Entegrasyonu Rehberi

Bu rehber, MongoDB'nin yerel veya AWS EC2 sunucusunda kurulumu ve projemize entegrasyonu için adımları içermektedir.

## 1. MongoDB Kurulumu

### Yerel Kurulum (Geliştirme için)

1. [MongoDB Community Edition](https://www.mongodb.com/try/download/community) adresinden işletim sisteminize uygun sürümü indirin.
2. Kurulum dosyasını çalıştırın ve talimatları izleyin.
3. MongoDB hizmetini başlatın:
   - Windows: Servisler uygulamasından "MongoDB" hizmetini başlatın.
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### AWS EC2 Üzerinde Kurulum

1. EC2 instance'ınıza SSH ile bağlanın.
2. MongoDB repository'sini ekleyin:
   ```bash
   sudo apt-get update
   sudo apt-get install gnupg
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   ```

3. MongoDB'yi yükleyin:
   ```bash
   sudo apt-get install -y mongodb-org
   ```

4. MongoDB'yi başlatın:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. MongoDB'nin çalıştığını doğrulayın:
   ```bash
   sudo systemctl status mongod
   ```

6. Güvenlik Grubu ayarlarından 27017 portunu açın (sadece güvenli IP'lerden erişime izin verin).

## 2. MongoDB Atlas Kullanımı (Alternatif)

Kendi sunucunuzu yönetmek istemiyorsanız, MongoDB Atlas kullanabilirsiniz:

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) üzerinde ücretsiz bir hesap oluşturun.
2. Yeni bir cluster oluşturun (ücretsiz tier).
3. Database Access bölümünden kullanıcı oluşturun.
4. Network Access bölümünden IP adresinizi (veya 0.0.0.0/0 ile tüm IP'leri) ekleyin.
5. Connect butonuna tıklayıp bağlantı URI'nizi alın.

## 3. Proje Entegrasyonu

### Gerekli Paketlerin Kurulumu

```bash
npm install mongodb express cors dotenv
```

### Bağlantı URI Yapılandırması

`.env` dosyasına MongoDB bağlantı URI'nizi ekleyin:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/oyunVeritabani
```

Atlas kullanıyorsanız:

```
PORT=3000
MONGODB_URI=mongodb+srv://<kullanici_adi>:<sifre>@<cluster-url>/oyunVeritabani?retryWrites=true&w=majority
```

### Bağlantıyı Test Etme

Oluşturduğumuz test script'lerini kullanarak bağlantıyı test edin:

```bash
node mongo-test.js  # Yerel MongoDB için
node atlas-test.js  # MongoDB Atlas için
```

## 4. Veri Tabanı Operasyonları

### Veri Ekleme

```javascript
// Oyunları ekle
const result = await db.collection('oyunlar').insertMany(oyunlar);
console.log(`${result.insertedCount} oyun başarıyla eklendi`);
```

### Veri Sorgulama

```javascript
// Tüm oyunları getir
const oyunlar = await db.collection('oyunlar').find().toArray();

// ID'ye göre oyun getir
const oyun = await db.collection('oyunlar').findOne({ Id: "1234567890" });

// Türe göre oyunları getir
const arcadeOyunlar = await db.collection('oyunlar').find({ Genres: "Arcade" }).toArray();
```

### Veri Güncelleme

```javascript
// Bir oyunu güncelle
const sonuc = await db.collection('oyunlar').updateOne(
  { Id: "1234567890" },
  { $set: { Title: "Yeni Başlık", Description: "Yeni açıklama" } }
);
console.log(`${sonuc.modifiedCount} oyun güncellendi`);
```

### Veri Silme

```javascript
// Bir oyunu sil
const silmeSonucu = await db.collection('oyunlar').deleteOne({ Id: "1234567890" });
console.log(`${silmeSonucu.deletedCount} oyun silindi`);
```

## 5. EC2 Üzerinde Node.js Uygulamasını Çalıştırma

1. Proje dosyalarını EC2'ye aktarın (git, scp veya başka bir yöntemle).
2. Gerekli paketleri yükleyin: `npm install`
3. PM2 ile uygulamayı başlatın (kalıcı çalışması için):
   ```bash
   npm install pm2 -g
   pm2 start index.js --name oyun-portali
   pm2 startup
   pm2 save
   ```

4. Nginx kurun ve proxy olarak yapılandırın:
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/oyun-portali
   ```

   Aşağıdaki içeriği ekleyin:
   ```
   server {
       listen 80;
       server_name domain.com www.domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. Nginx yapılandırmasını etkinleştirin:
   ```bash
   sudo ln -s /etc/nginx/sites-available/oyun-portali /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. SSL eklemek için Certbot kullanın:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d domain.com -d www.domain.com
   ```

## 6. Sık Karşılaşılan Sorunlar ve Çözümleri

1. **MongoDB bağlantı hatası:** 
   - MongoDB servisinin çalıştığından emin olun.
   - 27017 portunun açık olduğunu kontrol edin.
   - Bağlantı URI'sinin doğru olduğunu kontrol edin.

2. **ECONNREFUSED Hatası:**
   - MongoDB servisinin çalıştığından emin olun.
   - IP adresini kontrol edin (localhost, 127.0.0.1 veya sunucu IP'si).

3. **Authentication Hatası:**
   - Kullanıcı adı ve şifrenin doğru olduğunu kontrol edin.
   - Kullanıcının ilgili veritabanına erişim izni olduğunu kontrol edin.

4. **API Hatası:**
   - Uygulama loglarını kontrol edin.
   - MongoDB bağlantısının başarılı olduğunu doğrulayın.
   - JSON formatını kontrol edin.

Bu rehber, MongoDB'yi yerel ortamınızda veya EC2 sunucusunda kurmanıza ve projenize entegre etmenize yardımcı olacaktır. Herhangi bir sorunla karşılaşırsanız, lütfen MongoDB dokümantasyonunu inceleyiniz veya destek kanallarına başvurunuz. 