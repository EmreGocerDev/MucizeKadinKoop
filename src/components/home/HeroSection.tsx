import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="animate-pulse">🍳</span>
              <span>El Yapımı Lezzetler</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Ev Yapımı{' '}
              <span className="bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
                Lezzetler
              </span>{' '}
              Kapınıza Gelsin
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Yerel ev aşçılarından taze, sağlıklı ve sevgiyle hazırlanmış ev yemeklerini 
              keşfedin. Annelerimizin mutfağından sizin sofralarınıza.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 group"
              >
                <span>Menüyü Keşfet</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/become-seller"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
              >
                Satıcı Ol
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-gray-600 text-sm">Ev Aşçısı</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-gray-600 text-sm">Mutlu Müşteri</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9</p>
                <p className="text-gray-600 text-sm">Ortalama Puan</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                    alt="Lezzetli yemek"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop"
                    alt="Ev yapımı tatlı"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop"
                    alt="Sıcak çorba"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
                    alt="Taze salata"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">%100 Taze</p>
                  <p className="text-sm text-gray-500">Günlük Hazırlanır</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
