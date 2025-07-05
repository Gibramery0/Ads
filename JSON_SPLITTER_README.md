# JSON Dosya Parçalayıcı

Büyük JSON dosyalarını belirtilen boyut sınırına göre parçalayan Python script'i.

## 🚀 Kullanım

### Temel Kullanım
```bash
python json_splitter.py <json_dosyası> <max_boyut_mb>
```

### Örnekler

**25MB JSON dosyasını 3MB parçalara böl:**
```bash
python json_splitter.py data.json 3
```

**Oyun veritabanını 5MB parçalara böl:**
```bash
python json_splitter.py games.json 5
```

**1.5MB parçalar oluştur:**
```bash
python json_splitter.py large_data.json 1.5
```

## 📋 Gereksinimler

- Python 3.6+
- JSON dosyası array formatında olmalı: `[{...}, {...}, {...}]`

## 📁 Çıktı

Script çalıştırıldığında:

1. **Çıktı klasörü** oluşturulur: `{dosya_adı}_chunks/`
2. **Parça dosyaları** oluşturulur: `{dosya_adı}_part_001.json`, `{dosya_adı}_part_002.json`, vb.
3. **Detaylı rapor** gösterilir

### Örnek Çıktı:
```
📄 Dosya: games.json
📏 Boyut: 25.34MB
🎯 Max parça boyutu: 3MB

📖 JSON dosyası okunuyor...
📊 Toplam item sayısı: 5400

⚙️  Parçalama işlemi başlıyor...
📈 Tahmini parça sayısı: 9
📊 Gerçek parça sayısı: 9

📁 Çıktı klasörü oluşturuldu: games_chunks

💾 9 parça kaydediliyor...
   ✅ games_part_001.json - 2.98MB (600 item)
   ✅ games_part_002.json - 2.97MB (599 item)
   ✅ games_part_003.json - 2.99MB (601 item)
   ...

🎉 İşlem tamamlandı!
📁 Çıktı klasörü: games_chunks
📦 Toplam parça: 9
📏 Toplam çıktı boyutu: 25.67MB
💾 Boyut farkı: 0.33MB (formatting nedeniyle)
```

## ⚙️ Özellikler

- ✅ **Boyut kontrolü**: Her parça belirtilen sınırı aşmaz
- ✅ **Akıllı parçalama**: Item'ları böler, JSON yapısını korur
- ✅ **Detaylı rapor**: Boyut ve item sayısı bilgileri
- ✅ **Hata kontrolü**: Dosya ve format kontrolü
- ✅ **UTF-8 desteği**: Türkçe karakterler desteklenir
- ✅ **Esnek boyut**: Ondalıklı MB değerleri (örn: 1.5MB)

## 🔧 Teknik Detaylar

### Desteklenen Format
```json
[
  {"id": 1, "name": "Item 1"},
  {"id": 2, "name": "Item 2"},
  {"id": 3, "name": "Item 3"}
]
```

### Desteklenmeyen Format
```json
{
  "data": [...],
  "meta": {...}
}
```

## 🚨 Uyarılar

- Tek bir item max boyutu aşarsa uyarı verilir ama işlem devam eder
- JSON formatting nedeniyle çıktı boyutu biraz artabilir
- Sadece array formatındaki JSON dosyaları desteklenir

## 📞 Yardım

Script'i parametresiz çalıştırarak yardım alabilirsiniz:
```bash
python json_splitter.py --help
```
