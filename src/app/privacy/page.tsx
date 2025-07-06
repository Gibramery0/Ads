"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Toplanan Bilgiler</h2>
          <p>
            Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
          </p>
          <ul>
            <li>E-posta adresi</li>
            <li>Kullanıcı adı</li>
            <li>Oyun tercihleri ve istatistikleri</li>
            <li>Cihaz ve tarayıcı bilgileri</li>
            <li>IP adresi ve konum bilgileri</li>
          </ul>

          <h2>2. Bilgilerin Kullanımı</h2>
          <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
          <ul>
            <li>Hesap oluşturma ve yönetimi</li>
            <li>Kişiselleştirilmiş oyun deneyimi sunma</li>
            <li>Teknik destek sağlama</li>
            <li>Güvenlik ve dolandırıcılık önleme</li>
            <li>Hizmet iyileştirmeleri yapma</li>
          </ul>

          <h2>3. Bilgi Paylaşımı</h2>
          <p>
            Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız. 
            Aşağıdaki durumlar istisnadır:
          </p>
          <ul>
            <li>Yasal zorunluluklar</li>
            <li>Güvenlik tehditleri</li>
            <li>Hizmet sağlayıcıları (anonim veriler)</li>
          </ul>

          <h2>4. Çerezler (Cookies)</h2>
          <p>
            Sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. 
            Çerez ayarlarınızı tarayıcınızdan yönetebilirsiniz.
          </p>

          <h2>5. Veri Güvenliği</h2>
          <p>
            Verilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz:
          </p>
          <ul>
            <li>SSL şifreleme</li>
            <li>Güvenli sunucular</li>
            <li>Düzenli güvenlik denetimleri</li>
            <li>Erişim kontrolü</li>
          </ul>

          <h2>6. Kullanıcı Hakları</h2>
          <p>Aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Verilerinizi görme hakkı</li>
            <li>Verilerin düzeltilmesini isteme hakkı</li>
            <li>Verilerin silinmesini isteme hakkı</li>
            <li>Veri işlemeye itiraz etme hakkı</li>
          </ul>

          <h2>7. Üçüncü Taraf Hizmetleri</h2>
          <p>
            Sitemiz Google Analytics ve reklam hizmetleri kullanabilir. 
            Bu hizmetlerin kendi gizlilik politikaları vardır.
          </p>

          <h2>8. Çocukların Gizliliği</h2>
          <p>
            13 yaşından küçük çocuklardan bilerek kişisel bilgi toplamayız. 
            Böyle bir durumla karşılaştığımızda derhal sileriz.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu gizlilik politikası zaman zaman güncellenebilir. 
            Önemli değişiklikler e-posta ile bildirilir.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Gizlilik ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.
          </p>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
