#!/usr/bin/env python3
"""
JSON Dosya Parçalayıcı
Büyük JSON dosyalarını belirtilen boyut sınırına göre parçalar.

Kullanım:
python json_splitter.py <json_dosyası> <max_boyut_mb>

Örnek:
python json_splitter.py data.json 3
"""

import json
import os
import sys
import argparse
from typing import List, Dict, Any
import math

def get_file_size_mb(file_path: str) -> float:
    """Dosya boyutunu MB cinsinden döndürür"""
    if os.path.exists(file_path):
        size_bytes = os.path.getsize(file_path)
        return size_bytes / (1024 * 1024)
    return 0

def get_json_size_mb(data: Any) -> float:
    """JSON verisinin boyutunu MB cinsinden hesaplar"""
    json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    size_bytes = len(json_str.encode('utf-8'))
    return size_bytes / (1024 * 1024)

def print_progress_bar(current: int, total: int, prefix: str = "", suffix: str = "", length: int = 50):
    """Progress bar yazdırır"""
    if total == 0:
        return

    percent = (current / total) * 100
    filled_length = int(length * current // total)
    bar = '█' * filled_length + '-' * (length - filled_length)

    print(f'\r{prefix} |{bar}| {current}/{total} ({percent:.1f}%) {suffix}', end='', flush=True)

    if current == total:
        print()  # Yeni satır

def split_json_array(data: List[Any], max_size_mb: float) -> List[List[Any]]:
    """JSON array'ini boyut sınırına göre parçalar"""
    chunks = []
    current_chunk = []
    current_size = 0
    total_items = len(data)

    print(f"📊 Toplam {total_items:,} item işlenecek...")

    # Boş array için minimum boyut (2 byte: [])
    base_size = get_json_size_mb([])

    for i, item in enumerate(data):
        # Progress göster (her 100 item'da bir)
        if i % 100 == 0 or i == total_items - 1:
            print_progress_bar(i + 1, total_items, "⚙️  İşleniyor", f"(Chunk: {len(chunks) + 1})")

        item_size = get_json_size_mb([item])

        # Tek item max boyutu aşıyorsa uyarı ver
        if item_size > max_size_mb:
            print(f"\n⚠️  Uyarı: Item {i+1} ({item_size:.2f}MB) max boyutu ({max_size_mb}MB) aşıyor!")
            print(f"   Item preview: {str(item)[:100]}...")

        # Mevcut chunk'a eklenebilir mi kontrol et
        new_size = get_json_size_mb(current_chunk + [item])

        if new_size <= max_size_mb:
            current_chunk.append(item)
            current_size = new_size
        else:
            # Mevcut chunk'ı kaydet ve yeni chunk başlat
            if current_chunk:
                chunks.append(current_chunk)
                print(f"\n✅ Chunk {len(chunks)} tamamlandı: {len(current_chunk)} item, {current_size:.2f}MB")
            current_chunk = [item]
            current_size = item_size

    # Son chunk'ı ekle
    if current_chunk:
        chunks.append(current_chunk)
        print(f"\n✅ Son chunk tamamlandı: {len(current_chunk)} item, {current_size:.2f}MB")

    return chunks

def create_output_directory(json_file: str) -> str:
    """Çıktı klasörü oluşturur"""
    base_name = os.path.splitext(os.path.basename(json_file))[0]
    output_dir = f"{base_name}_chunks"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"📁 Çıktı klasörü oluşturuldu: {output_dir}")
    else:
        print(f"📁 Çıktı klasörü mevcut: {output_dir}")
    
    return output_dir

def try_alternative_json_parse(json_file: str) -> List[Any]:
    """Alternatif JSON parse yöntemi - satır satır okuma"""
    print(f"   📖 Dosya satır satır okunuyor...")

    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Dosya tek satırda mı kontrol et
        if '\n' not in content.strip():
            print(f"   📝 Tek satır JSON dosyası tespit edildi")
            # Tek satır JSON'u parçalara böl ve parse et
            return parse_single_line_json(content)
        else:
            # Çok satırlı JSON
            return json.loads(content)

    except Exception as e:
        raise Exception(f"Alternatif parse başarısız: {e}")

def parse_single_line_json(content: str) -> List[Any]:
    """Tek satır JSON'u güvenli şekilde parse eder"""
    print(f"   🔧 Tek satır JSON parse ediliyor...")

    # İlk ve son karakterleri kontrol et
    content = content.strip()

    # Farklı formatları kontrol et
    if content.startswith('[') and content.endswith(']'):
        print(f"   📋 JSON Array formatı tespit edildi")
        array_content = content[1:-1].strip()
    elif content.startswith('{') and content.endswith('}'):
        print(f"   📦 JSON Object formatı tespit edildi - Array'e dönüştürülüyor")
        # Tek objeyi array'e çevir
        return [json.loads(content)]
    else:
        # Belki de sadece objeler virgülle ayrılmış
        print(f"   🔍 Raw format tespit edildi - obje ayrıştırması deneniyor")
        array_content = content

    if not array_content:
        return []

    # Daha basit ve güvenli yöntem: JSONDecoder kullan
    import json.decoder

    objects = []
    decoder = json.JSONDecoder()
    idx = 0
    total_length = len(array_content)

    print(f"   📊 {total_length:,} karakter parse edilecek...")

    while idx < len(array_content):
        # Progress göster (her 10000 karakterde bir)
        if idx % 10000 == 0:
            progress = (idx / total_length) * 100
            print(f"   ⚙️  Progress: {progress:.1f}% ({len(objects)} obje bulundu)")

        # Boşlukları atla
        while idx < len(array_content) and array_content[idx].isspace():
            idx += 1

        if idx >= len(array_content):
            break

        # Virgülü atla
        if array_content[idx] == ',':
            idx += 1
            continue

        try:
            # Bir obje parse et
            obj, end_idx = decoder.raw_decode(array_content, idx)
            objects.append(obj)
            idx += end_idx

        except json.JSONDecodeError as e:
            print(f"\n   ⚠️  Parse hatası pozisyon {idx}: {e}")
            # Sonraki '{' karakterini bul
            next_brace = array_content.find('{', idx + 1)
            if next_brace == -1:
                print(f"   ❌ Daha fazla obje bulunamadı")
                break
            print(f"   🔄 Sonraki objeye atlıyor (pozisyon {next_brace})")
            idx = next_brace

    print(f"   ✅ {len(objects)} obje başarıyla parse edildi")
    return objects

def save_chunks(chunks: List[List[Any]], output_dir: str, base_name: str):
    """Parçaları ayrı dosyalara kaydeder"""
    total_chunks = len(chunks)
    digit_count = len(str(total_chunks))
    
    print(f"\n💾 {total_chunks} parça kaydediliyor...")
    
    for i, chunk in enumerate(chunks, 1):
        chunk_filename = f"{base_name}_part_{i:0{digit_count}d}.json"
        chunk_path = os.path.join(output_dir, chunk_filename)
        
        with open(chunk_path, 'w', encoding='utf-8') as f:
            json.dump(chunk, f, ensure_ascii=False, indent=2)
        
        chunk_size = get_file_size_mb(chunk_path)
        item_count = len(chunk)
        
        print(f"   ✅ {chunk_filename} - {chunk_size:.2f}MB ({item_count} item)")

def main():
    parser = argparse.ArgumentParser(
        description="JSON dosyasını boyut sınırına göre parçalar",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python json_splitter.py data.json 3        # 3MB parçalar
  python json_splitter.py games.json 5       # 5MB parçalar
  python json_splitter.py large.json 1.5     # 1.5MB parçalar
        """
    )
    
    parser.add_argument('json_file', help='Parçalanacak JSON dosyası')
    parser.add_argument('max_size', type=float, help='Maksimum parça boyutu (MB)')
    
    args = parser.parse_args()
    
    json_file = args.json_file
    max_size_mb = args.max_size
    
    # Dosya kontrolü
    if not os.path.exists(json_file):
        print(f"❌ Hata: '{json_file}' dosyası bulunamadı!")
        sys.exit(1)
    
    if max_size_mb <= 0:
        print(f"❌ Hata: Maksimum boyut pozitif olmalı! ({max_size_mb})")
        sys.exit(1)
    
    # Dosya bilgileri
    original_size = get_file_size_mb(json_file)
    print(f"📄 Dosya: {json_file}")
    print(f"📏 Boyut: {original_size:.2f}MB")
    print(f"🎯 Max parça boyutu: {max_size_mb}MB")
    
    if original_size <= max_size_mb:
        print(f"✅ Dosya zaten {max_size_mb}MB'dan küçük, parçalama gerekmiyor!")
        return
    
    # JSON dosyasını yükle
    print(f"\n📖 JSON dosyası okunuyor...")
    try:
        print(f"   📂 Dosya açılıyor...")
        with open(json_file, 'r', encoding='utf-8') as f:
            print(f"   📄 İçerik okunuyor...")
            content = f.read().strip()

        print(f"   📏 Okunan boyut: {len(content):,} karakter")

        # Dosya içeriğini kontrol et
        if not content:
            print(f"❌ Hata: Dosya boş!")
            sys.exit(1)

        # JSON parse işlemi
        print(f"   🔧 JSON parse ediliyor...")
        try:
            data = json.loads(content)
            print(f"   ✅ JSON başarıyla parse edildi!")
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse hatası: {e}")
            print(f"📍 Hata pozisyonu: {e.pos}")

            # Hata çevresindeki karakterleri göster
            start = max(0, e.pos - 50)
            end = min(len(content), e.pos + 50)
            error_context = content[start:end]

            print(f"🔍 Hata çevresi:")
            print(f"   ...{error_context}...")
            print(f"   {'   ' + ' ' * (e.pos - start)}^")

            # Alternatif çözüm öner
            print(f"\n💡 Olası çözümler:")
            print(f"   1. Dosyanın JSON formatında olduğundan emin olun")
            print(f"   2. String içindeki tırnakları escape edin (\\\") ")
            print(f"   3. Dosyayı JSON validator ile kontrol edin")

            # Dosyayı satır satır okumayı dene
            print(f"\n🔧 Alternatif okuma yöntemi deneniyor...")
            try:
                data = try_alternative_json_parse(json_file)
                print(f"✅ Alternatif yöntemle başarıyla okundu!")
            except Exception as alt_e:
                print(f"❌ Alternatif yöntem de başarısız: {alt_e}")
                sys.exit(1)

    except Exception as e:
        print(f"❌ Dosya okuma hatası: {e}")
        sys.exit(1)
    
    # Sadece array'leri destekliyoruz
    if not isinstance(data, list):
        print(f"❌ Hata: JSON dosyası bir array olmalı! Mevcut tip: {type(data).__name__}")
        print(f"   Örnek format: [{{'key': 'value'}}, {{'key': 'value'}}]")
        sys.exit(1)
    
    item_count = len(data)
    print(f"📊 Toplam item sayısı: {item_count}")
    
    if item_count == 0:
        print(f"⚠️  Boş array, parçalama gerekmiyor!")
        return
    
    # Parçalama işlemi
    print(f"\n⚙️  Parçalama işlemi başlıyor...")
    chunks = split_json_array(data, max_size_mb)
    
    estimated_chunks = math.ceil(original_size / max_size_mb)
    actual_chunks = len(chunks)
    
    print(f"📈 Tahmini parça sayısı: {estimated_chunks}")
    print(f"📊 Gerçek parça sayısı: {actual_chunks}")
    
    # Çıktı klasörü oluştur
    base_name = os.path.splitext(os.path.basename(json_file))[0]
    output_dir = create_output_directory(json_file)
    
    # Parçaları kaydet
    save_chunks(chunks, output_dir, base_name)
    
    # Özet bilgi
    print(f"\n🎉 İşlem tamamlandı!")
    print(f"📁 Çıktı klasörü: {output_dir}")
    print(f"📦 Toplam parça: {len(chunks)}")
    
    total_output_size = sum(get_file_size_mb(os.path.join(output_dir, f)) 
                           for f in os.listdir(output_dir) if f.endswith('.json'))
    print(f"📏 Toplam çıktı boyutu: {total_output_size:.2f}MB")
    print(f"💾 Boyut farkı: {total_output_size - original_size:.2f}MB (formatting nedeniyle)")

if __name__ == "__main__":
    main()
