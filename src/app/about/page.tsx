import { Heart, Shield, Users, Leaf, Award, Clock } from 'lucide-react';
import { getSiteSettings } from '@/lib/actions/settings';

const values = [
  {
    icon: Heart,
    title: 'Sevgi ile Hazırlanır',
    description: 'Her ürün, kooperatifimizin kadınlarının sevgisi ve özenle hazırlanır.',
  },
  {
    icon: Leaf,
    title: 'Taze & Doğal',
    description: 'Sadece taze ve doğal malzemeler kullanılır, katkı maddesi yoktur.',
  },
  {
    icon: Shield,
    title: 'Hijyen Garantisi',
    description: 'Tüm ürünlerimiz hijyenik ortamlarda hazırlanır.',
  },
  {
    icon: Users,
    title: 'Kadın Emeği',
    description: 'Kooperatifimizde kadınlar el emekleriyle ürün üretir.',
  },
  {
    icon: Award,
    title: 'Kalite Kontrolü',
    description: 'Her ürün kalite kontrolünden geçerek size ulaşır.',
  },
  {
    icon: Clock,
    title: 'Hızlı Teslimat',
    description: 'Siparişiniz taze olarak en kısa sürede kapınıza ulaşır.',
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {settings.about_title || 'Hakkımızda'}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {settings.about_description || 'Kırıkkale Mucize Kadın Kooperatifi olarak, el yapımı ürünlerimizi sizlerle buluşturuyoruz.'}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Hikayemiz
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p className="whitespace-pre-line">
                {settings.about_story || `Kırıkkale Mucize Kadın Kooperatifi olarak, kadınların el emeği ürünlerini sizlerle buluşturmak için yola çıktık. Kooperatifimiz, kadınların ekonomik özgürlüklerini desteklemek ve el yapımı ürünleri değerlendirmek amacıyla kurulmuştur.

Bugün onlarca kadın üyemizle birlikte, taze ve doğal ürünler üretiyoruz. Her ürünümüzde emek, sevgi ve özen var.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kooperatif olarak bu değerlerle hareket ediyor, her gün daha iyisini sunmak için çalışıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-orange-100 to-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
