"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/auth/register">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Genel Koşullar</h2>
          <p>
            Bu web sitesini kullanarak, aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. 
            Bu koşulları kabul etmiyorsanız, lütfen siteyi kullanmayın.
          </p>

          <h2>2. Hizmet Tanımı</h2>
          <p>
            Sitemiz, kullanıcılara ücretsiz online oyunlar oynama imkanı sunan bir platformdur. 
            Tüm oyunlar web tarayıcısı üzerinden oynanabilir.
          </p>

          <h2>3. Kullanıcı Sorumlulukları</h2>
          <ul>
            <li>Hesap bilgilerinizi güvenli tutmakla yükümlüsünüz</li>
            <li>Yasadışı faaliyetlerde bulunmamalısınız</li>
            <li>Diğer kullanıcılara saygılı davranmalısınız</li>
            <li>Telif hakkı ihlali yapmamalısınız</li>
          </ul>

          <h2>4. Yasaklanan Davranışlar</h2>
          <ul>
            <li>Sistemi hack etmeye çalışmak</li>
            <li>Spam veya zararlı içerik paylaşmak</li>
            <li>Başka kullanıcıların hesaplarını ele geçirmeye çalışmak</li>
            <li>Siteyi ticari amaçlarla kötüye kullanmak</li>
          </ul>

          <h2>5. Fikri Mülkiyet</h2>
          <p>
            Sitedeki tüm içerik, oyunlar ve tasarım telif hakkı ile korunmaktadır. 
            İzinsiz kullanım yasaktır.
          </p>

          <h2>6. Sorumluluk Reddi</h2>
          <p>
            Site yönetimi, hizmet kesintileri, veri kaybı veya diğer teknik sorunlardan 
            sorumlu değildir. Hizmet "olduğu gibi" sunulmaktadır.
          </p>

          <h2>7. Değişiklikler</h2>
          <p>
            Bu koşullar önceden haber verilmeksizin değiştirilebilir. 
            Güncel koşulları düzenli olarak kontrol etmeniz önerilir.
          </p>

          <h2>8. İletişim</h2>
          <p>
            Sorularınız için bizimle iletişime geçebilirsiniz.
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
