# Oyun Merkezi

Modern, performanslı ve ölçeklenebilir bir oyun portalı web uygulaması.

## Teknoloji Yığını

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js (API Routes)
- **Veritabanı:** MongoDB Atlas, Mongoose
- **Hosting:** Vercel

## Özellikler

- Binlerce oyunun listelendiği modern ve hızlı bir arayüz
- Oyunları iframe ile oynama imkanı
- Kategori filtreleme ve arama özellikleri
- SEO dostu, SSR destekli yapı
- Karanlık/Aydınlık tema desteği
- Tamamen duyarlı (responsive) tasarım
- MongoDB'den oyun verilerini çekme

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/kullaniciadi/oyun-merkezi.git
cd oyun-merkezi
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyası oluşturun:
```
MONGODB_URI=mongodb+srv://kullaniciadi:sifre@cluster0.mongodb.net/oyun-merkezi
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Proje Yapısı

```
oyun-merkezi/
├── public/           # Statik dosyalar
├── src/
│   ├── app/          # App Router sayfaları
│   ├── components/   # React bileşenleri
│   ├── lib/          # Yardımcı fonksiyonlar ve veritabanı bağlantısı
│   │   ├── db.ts     # MongoDB bağlantısı
│   │   ├── models/   # Mongoose modelleri
│   │   └── utils.ts  # Yardımcı fonksiyonlar
│   └── styles/       # Global CSS
├── .env.local        # Ortam değişkenleri
├── next.config.js    # Next.js yapılandırması
├── tailwind.config.js # Tailwind yapılandırması
└── package.json      # Proje bağımlılıkları
```

## İleride Eklenecek Özellikler

- Kullanıcı girişi ve kayıt sistemi
- Favori oyunlar ve oyun geçmişi
- Admin paneli
- Oyun yorumları ve puanlama sistemi
- Daha fazla oyun kategorisi ve filtre seçenekleri

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. "# Ads_v2" 
