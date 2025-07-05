#!/usr/bin/env python3
"""
Karakter Silme Script'i
Dosyalardan baştan ve sondan belirtilen sayıda karakter siler.

Kullanım:
python char_trimmer.py <dosya> <baştan_sil> <sondan_sil>

Örnek:
python char_trimmer.py data.txt 10 5
"""

import os
import sys
import argparse
import shutil
from datetime import datetime

def get_file_size(file_path: str) -> int:
    """Dosya boyutunu byte cinsinden döndürür"""
    if os.path.exists(file_path):
        return os.path.getsize(file_path)
    return 0

def format_size(size_bytes: int) -> str:
    """Dosya boyutunu okunabilir formatta döndürür"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    else:
        return f"{size_bytes / (1024 * 1024 * 1024):.1f} GB"

def create_backup(file_path: str) -> str:
    """Dosyanın yedeğini oluşturur"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.backup_{timestamp}"
    
    try:
        shutil.copy2(file_path, backup_path)
        print(f"💾 Yedek oluşturuldu: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"⚠️  Yedek oluşturulamadı: {e}")
        return ""

def trim_characters(content: str, start_chars: int, end_chars: int) -> str:
    """İçerikten baştan ve sondan karakter siler"""
    content_length = len(content)
    
    # Silinecek toplam karakter sayısı kontrolü
    total_to_remove = start_chars + end_chars
    if total_to_remove >= content_length:
        print(f"⚠️  Uyarı: Silinecek karakter sayısı ({total_to_remove}) dosya boyutundan ({content_length}) büyük!")
        print(f"   Dosya tamamen boşalacak.")
        return ""
    
    # Baştan sil
    if start_chars > 0:
        content = content[start_chars:]
    
    # Sondan sil
    if end_chars > 0:
        content = content[:-end_chars]
    
    return content

def process_file(file_path: str, start_chars: int, end_chars: int, create_backup_flag: bool = True):
    """Dosyayı işler"""
    
    # Dosya kontrolü
    if not os.path.exists(file_path):
        print(f"❌ Hata: '{file_path}' dosyası bulunamadı!")
        return False
    
    if not os.path.isfile(file_path):
        print(f"❌ Hata: '{file_path}' bir dosya değil!")
        return False
    
    # Dosya bilgileri
    original_size = get_file_size(file_path)
    print(f"📄 Dosya: {file_path}")
    print(f"📏 Orijinal boyut: {format_size(original_size)}")
    print(f"✂️  Baştan silinecek: {start_chars} karakter")
    print(f"✂️  Sondan silinecek: {end_chars} karakter")
    
    # Yedek oluştur
    backup_path = ""
    if create_backup_flag:
        backup_path = create_backup(file_path)
    
    try:
        # Dosyayı oku
        print(f"\n📖 Dosya okunuyor...")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_char_count = len(content)
        print(f"📊 Orijinal karakter sayısı: {original_char_count:,}")
        
        # Karakterleri sil
        print(f"⚙️  Karakter silme işlemi...")
        trimmed_content = trim_characters(content, start_chars, end_chars)
        
        new_char_count = len(trimmed_content)
        removed_chars = original_char_count - new_char_count
        
        print(f"📊 Yeni karakter sayısı: {new_char_count:,}")
        print(f"🗑️  Silinen karakter sayısı: {removed_chars:,}")
        
        # Dosyayı kaydet
        print(f"💾 Dosya kaydediliyor...")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(trimmed_content)
        
        # Yeni dosya bilgileri
        new_size = get_file_size(file_path)
        size_reduction = original_size - new_size
        
        print(f"\n✅ İşlem tamamlandı!")
        print(f"📏 Yeni boyut: {format_size(new_size)}")
        print(f"📉 Boyut azalması: {format_size(size_reduction)}")
        
        if backup_path:
            print(f"💾 Yedek dosya: {backup_path}")
        
        return True
        
    except UnicodeDecodeError:
        print(f"❌ Hata: Dosya UTF-8 formatında değil!")
        print(f"   Binary dosyalar desteklenmiyor.")
        return False
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(
        description="Dosyalardan baştan ve sondan karakter siler",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Örnekler:
  python char_trimmer.py data.txt 10 5      # Baştan 10, sondan 5 karakter sil
  python char_trimmer.py file.json 0 100    # Sadece sondan 100 karakter sil
  python char_trimmer.py log.txt 50 0       # Sadece baştan 50 karakter sil
  python char_trimmer.py text.txt 10 10 --no-backup  # Yedek almadan sil
        """
    )
    
    parser.add_argument('file', help='İşlenecek dosya')
    parser.add_argument('start_chars', type=int, help='Baştan silinecek karakter sayısı')
    parser.add_argument('end_chars', type=int, help='Sondan silinecek karakter sayısı')
    parser.add_argument('--no-backup', action='store_true', help='Yedek dosya oluşturma')
    
    args = parser.parse_args()
    
    file_path = args.file
    start_chars = args.start_chars
    end_chars = args.end_chars
    create_backup_flag = not args.no_backup
    
    # Parametre kontrolü
    if start_chars < 0:
        print(f"❌ Hata: Baştan silinecek karakter sayısı negatif olamaz! ({start_chars})")
        sys.exit(1)
    
    if end_chars < 0:
        print(f"❌ Hata: Sondan silinecek karakter sayısı negatif olamaz! ({end_chars})")
        sys.exit(1)
    
    if start_chars == 0 and end_chars == 0:
        print(f"⚠️  Uyarı: Hiçbir karakter silinmeyecek!")
        print(f"   Baştan: {start_chars}, Sondan: {end_chars}")
        return
    
    # Onay al
    total_chars = start_chars + end_chars
    print(f"🔍 İşlem Özeti:")
    print(f"   Dosya: {file_path}")
    print(f"   Baştan silinecek: {start_chars} karakter")
    print(f"   Sondan silinecek: {end_chars} karakter")
    print(f"   Toplam silinecek: {total_chars} karakter")
    print(f"   Yedek oluştur: {'Evet' if create_backup_flag else 'Hayır'}")
    
    response = input(f"\n❓ Devam etmek istiyor musunuz? (y/N): ").strip().lower()
    if response not in ['y', 'yes', 'evet', 'e']:
        print(f"❌ İşlem iptal edildi.")
        return
    
    # Dosyayı işle
    success = process_file(file_path, start_chars, end_chars, create_backup_flag)
    
    if success:
        print(f"\n🎉 Başarıyla tamamlandı!")
    else:
        print(f"\n💥 İşlem başarısız!")
        sys.exit(1)

if __name__ == "__main__":
    main()
