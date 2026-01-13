'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  DollarSign, Clock, Shield, Star, 
  CheckCircle, Upload, ArrowRight 
} from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Yüksek Kazanç',
    description: 'Yemeklerinizi satarak aylık ₺15.000+ kazanabilirsiniz.',
  },
  {
    icon: Clock,
    title: 'Esnek Çalışma',
    description: 'Kendi çalışma saatlerinizi ve kapasitenizi belirleyin.',
  },
  {
    icon: Shield,
    title: 'Güvenli Ödeme',
    description: 'Kazancınız düzenli olarak hesabınıza aktarılır.',
  },
  {
    icon: Star,
    title: 'Düşük Komisyon',
    description: 'Sadece %10 komisyon, geri kalanı sizin.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Başvuru Yapın',
    description: 'Formu doldurun ve mutfağınız hakkında bilgi verin.',
  },
  {
    number: '02',
    title: 'Onay Süreci',
    description: 'Ekibimiz başvurunuzu inceleyip size dönüş yapar.',
  },
  {
    number: '03',
    title: 'Mutfak Denetimi',
    description: 'Hijyen standartları için mutfağınız denetlenir.',
  },
  {
    number: '04',
    title: 'Satışa Başlayın',
    description: 'Onay aldıktan sonra ürünlerinizi listelemeye başlayın.',
  },
];

export default function BecomeSellerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    storeName: '',
    specialties: '',
    experience: '',
    description: '',
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Başvurunuz Alındı!
          </h1>
          <p className="text-gray-600 mb-8">
            Başvurunuz başarıyla alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek. 
            Ortalama değerlendirme süresi 2-3 iş günüdür.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Ev Aşçısı Olun, Kazanmaya Başlayın
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Mutfağınızdaki yeteneklerinizi binlerce kişiyle paylaşın. 
                Kendi işinizin patronu olun, tutkunuzdan para kazanın.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Ücretsiz Başvuru</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Hızlı Onay</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>7/24 Destek</span>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop"
                alt="Ev Aşçısı"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden Ev Lezzetleri?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Size sunduğumuz avantajlarla işinizi büyütün.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              4 basit adımda satışa başlayın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <span className="text-5xl font-bold text-orange-100">{step.number}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 h-8 w-8 text-orange-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-white" id="basvuru">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Image
              src="/logo.png"
              alt="Kırıkkale Mucize Kadın Kooperatifi"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Başvuru Formu
            </h2>
            <p className="text-gray-600">
              Aşağıdaki formu doldurun, ekibimiz sizinle iletişime geçsin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-2xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mağaza Adı *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  placeholder="Örn: Ayşe'nin Mutfağı"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İl *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Seçin</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlçe *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uzmanlık Alanlarınız *
              </label>
              <input
                type="text"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                required
                placeholder="Örn: Türk mutfağı, tatlılar, börekler"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deneyiminiz *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Seçin</option>
                <option value="1-3">1-3 yıl</option>
                <option value="3-5">3-5 yıl</option>
                <option value="5-10">5-10 yıl</option>
                <option value="10+">10+ yıl</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kendinizi Tanıtın
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Mutfağınız, yemek yapma tutkunuz ve size özel olan şeyler hakkında bilgi verin..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mutfak Fotoğrafları (Opsiyonel)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Fotoğraf yüklemek için tıklayın</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG max 5MB</p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600">
                <Link href="/terms" className="text-orange-600 hover:underline">Satıcı Sözleşmesi</Link>
                {' '}ve{' '}
                <Link href="/privacy" className="text-orange-600 hover:underline">Gizlilik Politikası</Link>
                &apos;nı okudum ve kabul ediyorum.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !formData.acceptTerms}
              className="w-full bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Başvuru Yap'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
