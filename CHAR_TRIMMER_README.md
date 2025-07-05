# Karakter Silme Script'i

Dosyalardan baştan ve sondan belirtilen sayıda karakter silen Python script'i.

## 🚀 Kullanım

### Temel Kullanım
```bash
python char_trimmer.py <dosya> <baştan_sil> <sondan_sil>
```

### Örnekler

**Baştan 10, sondan 5 karakter sil:**
```bash
python char_trimmer.py data.txt 10 5
```

**Sadece sondan 100 karakter sil:**
```bash
python char_trimmer.py file.json 0 100
```

**Sadece baştan 50 karakter sil:**
```bash
python char_trimmer.py log.txt 50 0
```

**Yedek almadan sil:**
```bash
python char_trimmer.py text.txt 10 10 --no-backup
```

## 📋 Gereksinimler

- Python 3.6+
- UTF-8 formatında text dosyaları

## 🔧 Parametreler

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `file` | İşlenecek dosya | `data.txt` |
| `start_chars` | Baştan silinecek karakter sayısı | `10` |
| `end_chars` | Sondan silinecek karakter sayısı | `5` |
| `--no-backup` | Yedek dosya oluşturma (opsiyonel) | - |

## 📁 Çıktı

Script çalıştırıldığında:

1. **Yedek dosya** oluşturulur: `dosya.txt.backup_20250103_143022`
2. **Orijinal dosya** güncellenir
3. **Detaylı rapor** gösterilir

### Örnek Çıktı:
```
🔍 İşlem Özeti:
   Dosya: data.txt
   Baştan silinecek: 10 karakter
   Sondan silinecek: 5 karakter
   Toplam silinecek: 15 karakter
   Yedek oluştur: Evet

❓ Devam etmek istiyor musunuz? (y/N): y

📄 Dosya: data.txt
📏 Orijinal boyut: 1.2 MB
✂️  Baştan silinecek: 10 karakter
✂️  Sondan silinecek: 5 karakter

💾 Yedek oluşturuldu: data.txt.backup_20250103_143022

📖 Dosya okunuyor...
📊 Orijinal karakter sayısı: 1,234,567
⚙️  Karakter silme işlemi...
📊 Yeni karakter sayısı: 1,234,552
🗑️  Silinen karakter sayısı: 15
💾 Dosya kaydediliyor...

✅ İşlem tamamlandı!
📏 Yeni boyut: 1.2 MB
📉 Boyut azalması: 15 B
💾 Yedek dosya: data.txt.backup_20250103_143022

🎉 Başarıyla tamamlandı!
```

## ⚙️ Özellikler

- ✅ **Güvenli işlem**: Otomatik yedek oluşturma
- ✅ **Onay sistemi**: İşlem öncesi kullanıcı onayı
- ✅ **Detaylı rapor**: Boyut ve karakter sayısı bilgileri
- ✅ **Hata kontrolü**: Dosya ve parametre kontrolü
- ✅ **UTF-8 desteği**: Türkçe karakterler desteklenir
- ✅ **Esnek kullanım**: Sadece baştan veya sondan silme

## 🔧 Kullanım Senaryoları

### 1. Log Dosyası Temizleme
```bash
# Log dosyasının başındaki timestamp'leri sil
python char_trimmer.py app.log 25 0
```

### 2. JSON Dosyası Düzenleme
```bash
# JSON dosyasının başındaki ve sonundaki gereksiz karakterleri sil
python char_trimmer.py data.json 3 1
```

### 3. Text Dosyası Kırpma
```bash
# Text dosyasının başından ve sonundan gereksiz boşlukları sil
python char_trimmer.py document.txt 10 10
```

### 4. CSV Dosyası Düzenleme
```bash
# CSV dosyasının header'ını sil
python char_trimmer.py data.csv 50 0
```

## 🚨 Uyarılar

- **Yedek önemli**: `--no-backup` kullanırken dikkatli olun
- **UTF-8 gerekli**: Binary dosyalar desteklenmez
- **Boyut kontrolü**: Silinecek karakter sayısı dosya boyutundan büyük olabilir
- **Geri alınamaz**: Yedek olmadan yapılan değişiklikler geri alınamaz

## 🛡️ Güvenlik

- Otomatik yedek oluşturma
- İşlem öncesi onay alma
- Parametre doğrulama
- Hata durumunda güvenli çıkış

## 📞 Yardım

Script'i parametresiz çalıştırarak yardım alabilirsiniz:
```bash
python char_trimmer.py --help
```

## 🔄 Yedek Dosyaları

Yedek dosyaları şu formatta oluşturulur:
```
dosya.txt.backup_YYYYMMDD_HHMMSS
```

Örnek:
```
data.txt.backup_20250103_143022
log.txt.backup_20250103_143045
```
