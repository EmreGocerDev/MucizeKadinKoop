'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Phone, CreditCard, Building, Truck, 
  ChevronRight, Shield, Lock, ArrowLeft, Loader2 
} from 'lucide-react';
import { getCart } from '@/lib/actions/cart';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    slug: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Adres
    fullName: '',
    phone: '',
    city: 'Kırıkkale',
    district: '',
    address: '',
    notes: '',
    // Ödeme
    paymentMethod: 'credit_card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const cart = await getCart();
    if (!cart || cart.cart_items.length === 0) {
      router.push('/cart');
      return;
    }
    setCartItems(cart.cart_items);
    setLoading(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
  const deliveryFee = subtotal >= 150 ? 0 : 15;
  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // PayTR iframe'ini göster
    setShowPaymentIframe(true);
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Sepete Dön</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Güvenli Ödeme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium hidden sm:block">Teslimat</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium hidden sm:block">Ödeme</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
                ✓
              </div>
              <span className="font-medium hidden sm:block">Onay</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  Teslimat Adresi
                </h2>

                <form onSubmit={handleSubmitAddress} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
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
                        Telefon *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="+90 (5XX) XXX XX XX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
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
                      Açık Adres *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="Mahalle, sokak, bina no, daire no..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teslimat Notu (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Örn: Zili çalmayın, kapıda bekleyin..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Ödemeye Geç
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && !showPaymentIframe && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  Ödeme Yöntemi
                </h2>

                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'credit_card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <CreditCard className="h-6 w-6 text-orange-600" />
                      <span className="font-medium">Kredi Kartı</span>
                    </label>

                    <label className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'bank_transfer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Building className="h-6 w-6 text-blue-600" />
                      <span className="font-medium">Havale/EFT</span>
                    </label>

                    <label className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formData.paymentMethod === 'cash_on_delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <Truck className="h-6 w-6 text-emerald-600" />
                      <span className="font-medium">Kapıda Ödeme</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'credit_card' && (
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-800 font-medium">
                        PayTR Güvenli Ödeme ile ödeme yapacaksınız
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Kart bilgileriniz tamamen güvende
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                      Geri
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                    >
                      {isProcessing ? 'İşleniyor...' : `₺${total.toFixed(2)} Öde`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PayTR iFrame */}
            {showPaymentIframe && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-emerald-600" />
                  Güvenli Ödeme
                </h2>

                {/* PayTR iFrame Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <div className="max-w-md mx-auto">
                    <Shield className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      PayTR Ödeme Sayfası
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Burada PayTR iFrame gösterilecek. Entegrasyon yapıldığında 
                      gerçek ödeme formu görünecektir.
                    </p>
                    
                    {/* Simüle edilmiş ödeme formu */}
                    <div className="bg-white p-6 rounded-xl shadow-md text-left">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma</label>
                            <input 
                              type="text" 
                              placeholder="AA/YY"
                              className="w-full px-4 py-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input 
                              type="text" 
                              placeholder="***"
                              className="w-full px-4 py-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => setStep(3)}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          ₺{total.toFixed(2)} Öde
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      * Bu demo amaçlıdır. Gerçek ödeme PayTR entegrasyonu ile yapılacaktır.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaymentIframe(false)}
                  className="mt-4 text-gray-600 hover:text-gray-900"
                >
                  ← Ödeme yöntemini değiştir
                </button>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Siparişiniz Alındı!
                </h2>
                <p className="text-gray-600 mb-6">
                  Sipariş numaranız: <span className="font-semibold">EL20260113-000001</span>
                </p>
                <p className="text-gray-600 mb-8">
                  Siparişiniz hazırlanmaya başlandı. Durumu takip etmek için 
                  hesabınızdaki siparişlerim bölümünü ziyaret edebilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/orders"
                    className="bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Siparişlerimi Görüntüle
                  </Link>
                  <Link
                    href="/"
                    className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.products.name}</p>
                      <p className="text-orange-600 font-semibold">₺{(item.products.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600' : ''}>
                    {deliveryFee === 0 ? 'Ücretsiz' : `₺${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Güvenli Alışveriş</p>
                  <p className="text-xs text-gray-500">256-bit SSL Şifreleme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
