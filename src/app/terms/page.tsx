import Link from 'next/link';
import { FileText, ShoppingCart, CreditCard, Truck, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kullanım Şartları
          </h1>
          <p className="text-gray-600">
            Son güncelleme: 13 Ocak 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-10">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Kırıkkale Mucize Kadın Kooperatifi web sitesini kullanarak, aşağıdaki şartları ve koşulları 
              kabul etmiş sayılırsınız. Lütfen bu şartları dikkatli bir şekilde okuyunuz.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Bu web sitesi Kırıkkale Mucize Kadın Kooperatifi tarafından işletilmektedir. 
                Siteyi kullanarak, bu kullanım şartlarına ve gizlilik politikamıza uymayı kabul edersiniz.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>18 yaşından büyük olmalısınız veya veli izniniz olmalıdır</li>
                <li>Doğru ve güncel bilgiler sağlamayı taahhüt edersiniz</li>
                <li>Hesap güvenliğinizden siz sorumlusunuz</li>
                <li>Siteyi yasal amaçlarla kullanmayı kabul edersiniz</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">2. Sipariş ve Satın Alma</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir</li>
                <li>Siparişiniz onaylandığında size e-posta ile bilgi verilecektir</li>
                <li>Stok durumuna göre sipariş kabul edilir</li>
                <li>Yanlış veya eksik bilgi nedeniyle oluşan sorunlardan müşteri sorumludur</li>
                <li>Kampanya ve indirimler stoklarla sınırlıdır</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">3. Ödeme Koşulları</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>Aşağıdaki ödeme yöntemlerini kabul ediyoruz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kredi kartı / Banka kartı (PayTR altyapısı ile güvenli ödeme)</li>
                <li>Havale / EFT</li>
                <li>Kapıda ödeme (belirli bölgelerde)</li>
              </ul>
              <p className="mt-4">
                Ödeme bilgileriniz SSL şifreleme ile korunmaktadır. 
                Kart bilgileriniz tarafımızca saklanmaz.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">4. Teslimat</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Teslimat süresi sipariş onayından itibaren 1-3 iş günüdür</li>
                <li>Teslimat adresi doğru ve eksiksiz olmalıdır</li>
                <li>Gıda ürünleri için özel paketleme yapılmaktadır</li>
                <li>Teslimat sırasında ürünü kontrol ediniz</li>
                <li>Hasarlı veya eksik ürün için hemen bildirimde bulununuz</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">5. İade ve İptal</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p><strong>Gıda ürünleri için özel kurallar:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gıda ürünleri hijyen kuralları gereği iade alınmaz</li>
                <li>Bozuk veya hasarlı ürünler için 24 saat içinde bildirim yapılmalıdır</li>
                <li>Fotoğraflı kanıt ile iade/değişim talep edilebilir</li>
                <li>İade onaylandığında 7 iş günü içinde ödemeniz iade edilir</li>
              </ul>
              <p className="mt-4"><strong>Sipariş iptali:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hazırlanmadan önce sipariş iptal edilebilir</li>
                <li>Hazırlanan siparişler iptal edilemez</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">6. Sorumluluk Sınırları</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Alerjen bilgisi ürün açıklamalarında belirtilmektedir</li>
                <li>Alerjiniz varsa ürün içeriklerini kontrol ediniz</li>
                <li>Ürünler önerilen saklama koşullarında muhafaza edilmelidir</li>
                <li>Tüketim tarihi geçen ürünler tüketilmemelidir</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Fikri Mülkiyet</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Web sitemizdeki tüm içerikler (metinler, görseller, logolar, tasarımlar) 
                Kırıkkale Mucize Kadın Kooperatifi&apos;ne aittir ve telif hakları ile korunmaktadır. 
                İzinsiz kullanım yasaktır.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Değişiklikler</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Bu kullanım şartları önceden haber verilmeksizin değiştirilebilir. 
                Değişiklikler web sitesinde yayınlandığı anda yürürlüğe girer. 
                Siteyi kullanmaya devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Uygulanacak Hukuk</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. 
                Herhangi bir uyuşmazlık durumunda Kırıkkale Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p><strong>Kırıkkale Mucize Kadın Kooperatifi</strong></p>
              <p className="mt-2">E-posta: info@kirikkalekooperatif.com</p>
              <p>Telefon: +90 (318) 123 45 67</p>
              <p>Adres: Kırıkkale, Türkiye</p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
