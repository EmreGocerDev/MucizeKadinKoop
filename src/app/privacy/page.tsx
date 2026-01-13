import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gizlilik Politikası
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
              Kırıkkale Mucize Kadın Kooperatifi olarak, kişisel verilerinizin gizliliğine büyük önem veriyoruz. 
              Bu gizlilik politikası, web sitemizi kullanırken toplanan, işlenen ve korunan veriler hakkında 
              sizi bilgilendirmek amacıyla hazırlanmıştır.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">1. Toplanan Veriler</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>Web sitemizi kullanırken aşağıdaki veriler toplanabilir:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası</li>
                <li><strong>Hesap Bilgileri:</strong> Kullanıcı adı, şifre (şifrelenmiş olarak)</li>
                <li><strong>Sipariş Bilgileri:</strong> Teslimat adresi, sipariş geçmişi, ödeme bilgileri</li>
                <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgisi</li>
                <li><strong>Kullanım Verileri:</strong> Sayfa görüntülemeleri, tıklamalar, site içi davranışlar</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">2. Verilerin Kullanım Amaçları</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>Toplanan veriler aşağıdaki amaçlarla kullanılır:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Siparişlerinizi işlemek ve teslim etmek</li>
                <li>Hesabınızı yönetmek ve güvenliğini sağlamak</li>
                <li>Müşteri hizmetleri desteği sunmak</li>
                <li>Ürün ve hizmetlerimizi geliştirmek</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                <li>İzniniz dahilinde pazarlama iletişimleri göndermek</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">3. Veri Güvenliği</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>Kişisel verilerinizin güvenliği için aşağıdaki önlemleri alıyoruz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL şifreleme ile güvenli veri iletimi</li>
                <li>Şifrelerin güvenli hash algoritmaları ile saklanması</li>
                <li>Düzenli güvenlik güncellemeleri ve denetimleri</li>
                <li>Yetkisiz erişime karşı güvenlik duvarları</li>
                <li>Çalışanlarımıza veri güvenliği eğitimi</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">4. Haklarınız</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verilerinize erişim talep etme</li>
                <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
                <li>Verilerin işlenmesini kısıtlama veya itiraz etme</li>
                <li>Verilerinizi taşınabilir formatta alma</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">5. İletişim</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>Gizlilik politikamız hakkında sorularınız için bize ulaşın:</p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p><strong>Kırıkkale Mucize Kadın Kooperatifi</strong></p>
                <p className="mt-2">E-posta: info@kirikkalekooperatif.com</p>
                <p>Telefon: +90 (318) 123 45 67</p>
                <p>Adres: Kırıkkale, Türkiye</p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır. 
                Çerezler, tarayıcınıza kaydedilen küçük metin dosyalarıdır. 
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, 
                ancak bu durumda bazı özellikler düzgün çalışmayabilir.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Politika Güncellemeleri</h2>
            <div className="text-gray-700">
              <p>
                Bu gizlilik politikası zaman zaman güncellenebilir. 
                Önemli değişiklikler olması durumunda sizi bilgilendireceğiz. 
                Politikayı düzenli olarak kontrol etmenizi öneririz.
              </p>
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
