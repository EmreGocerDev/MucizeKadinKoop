import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChefHat, Star, Utensils } from 'lucide-react';

export default function BecomeSellerSection() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop"
                alt="Ev aşçısı"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₺15K+</p>
                  <p className="text-sm text-gray-500">Aylık Ortalama Kazanç</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
              Yeteneklerinizi Paylaşın
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ev Aşçısı Olun, Kazanmaya Başlayın
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Mutfağınızda hazırladığınız lezzetleri binlerce kişiyle paylaşın. 
              Kendi çalışma saatlerinizi belirleyin, tutkunuzu gelire dönüştürün.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <ChefHat className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Esnek Çalışma</h4>
                  <p className="text-gray-600 text-sm">İstediğiniz zaman, istediğiniz kadar sipariş alın.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Düşük Komisyon</h4>
                  <p className="text-gray-600 text-sm">Kazancınızın büyük kısmı sizin, sadece %10 komisyon.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Utensils className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Destek Ekibi</h4>
                  <p className="text-gray-600 text-sm">7/24 destek ekibimiz yanınızda.</p>
                </div>
              </div>
            </div>

            <Link
              href="/become-seller"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 group"
            >
              <span>Hemen Başvur</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
