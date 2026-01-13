import { Truck, Shield, Clock, Heart } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Sevgiyle Hazırlanır',
    description: 'Her yemek, ev aşçılarımız tarafından özenle ve sevgiyle hazırlanır.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Shield,
    title: 'Hijyen Garantisi',
    description: 'Tüm mutfaklar düzenli olarak denetlenir ve hijyen standartlarına uyar.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Siparişiniz taze bir şekilde, en kısa sürede kapınıza ulaşır.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Clock,
    title: 'Günlük Taze',
    description: 'Yemekler sipariş üzerine hazırlanır, dondurulmuş ürün kullanılmaz.',
    color: 'bg-orange-100 text-orange-600'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ev Lezzetleri olarak, size en kaliteli ve güvenilir hizmeti sunmak için çalışıyoruz.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
