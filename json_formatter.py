import json
import os
import sys
import time

def read_with_progress(filename):
    file_size = os.path.getsize(filename)
    chunk_size = 1024 * 1024  # 1MB parça parça okuyacağız
    read_size = 0
    content = ''

    with open(filename, 'r', encoding='utf-8') as file:
        while True:
            chunk = file.read(chunk_size)
            if not chunk:
                break
            content += chunk
            read_size += len(chunk)
            progress = (read_size / file_size) * 100
            sys.stdout.write(f"\rYükleniyor: [{int(progress)//2 * '#'}{(50 - int(progress)//2) * '-'}] {progress:.2f}%")
            sys.stdout.flush()
            time.sleep(0.05)  # Çok hızlı olmasın diye küçük bir bekleme ekledim (isteğe bağlı)

    print("\nYükleme tamamlandı!")
    return content

def format_json(content):
    data = json.loads(content)
    pretty_json = json.dumps(data, indent=4, ensure_ascii=False)
    return pretty_json

def main():
    input_file = 'D:\İndirilenler\Wizard_Data.json'
    output_file = 'duzenli_veri.json'

    try:
        content = read_with_progress(input_file)
        formatted = format_json(content)

        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(formatted)

        print(f"\nJSON başarıyla '{output_file}' dosyasına kaydedildi!")

    except json.JSONDecodeError as e:
        print("\nHATA: JSON dosyası geçersiz!")
        print(f"Detay: {e}")
    except Exception as e:
        print("\nBeklenmeyen bir hata oluştu.")
        print(f"Detay: {e}")

if __name__ == "__main__":
    main()
