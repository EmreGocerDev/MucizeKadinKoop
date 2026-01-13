import Image from 'next/image';
import { Heart, Shield, Users, Leaf, Award, Clock } from 'lucide-react';

const team = [
  {
    name: 'Ayşe Yıldız',
    role: 'Kurucu & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  },
  {
    name: 'Mehmet Kaya',
    role: 'Operasyon Müdürü',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    name: 'Zeynep Demir',
    role: 'Müşteri İlişkileri',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Sevgi ile Hazırlanır',
    description: 'Her yemek, ev aşçılarımızın sevgisi ve özenle hazırlanır.',
  },
  {
    icon: Leaf,
    title: 'Taze & Doğal',
    description: 'Sadece taze ve doğal malzemeler kullanılır, katkı maddesi yoktur.',
  },
  {
    icon: Shield,
    title: 'Hijyen Garantisi',
    description: 'Tüm mutfaklar düzenli denetimlerden geçer ve sertifikalıdır.',
  },
  {
    icon: Users,
    title: 'Topluluk Desteği',
    description: 'Yerel ev aşçılarını destekleyerek ekonomiye katkı sağlıyoruz.',
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

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Ev Lezzetleri olarak, ev yapımı yemeklerin tadını ve sıcaklığını 
            herkesin sofrasına taşımak için yola çıktık.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
                alt="Hikayemiz"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  2024 yılında İstanbul&apos;da kurulan Ev Lezzetleri, annelerimizin, 
                  ninelerimizin mutfaklarından çıkan o eşsiz tatları modern dünyaya 
                  taşıma hayaliyle başladı.
                </p>
                <p>
                  Bugün 500&apos;den fazla ev aşçısı ile çalışıyor, binlerce aileye 
                  ev sıcaklığında yemekler ulaştırıyoruz. Her siparişte sadece 
                  yemek değil, sevgi ve emek de taşıyoruz.
                </p>
                <p>
                  Misyonumuz, herkesin kaliteli ve sağlıklı ev yemeklerine 
                  kolayca ulaşabilmesini sağlamak. Vizyonumuz ise Türkiye&apos;nin 
                  en güvenilir ev yemeği platformu olmak.
                </p>
              </div>
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
              Ev Lezzetleri olarak bu değerlerle hareket ediyor, her gün daha iyisini sunmak için çalışıyoruz.
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

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">500+</p>
              <p className="text-white/80 mt-2">Ev Aşçısı</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">10K+</p>
              <p className="text-white/80 mt-2">Mutlu Müşteri</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">50K+</p>
              <p className="text-white/80 mt-2">Sipariş</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">4.9</p>
              <p className="text-white/80 mt-2">Ortalama Puan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ev Lezzetleri&apos;ni sizin için daha iyi hale getirmek için çalışan ekibimizle tanışın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-orange-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
