'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { getCart, updateCartItem, removeFromCart } from '@/lib/actions/cart';

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

interface Cart {
  id: string;
  cart_items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    const cartData = await getCart();
    setCart(cartData);
    setLoading(false);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    startTransition(async () => {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    });
  };

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      await removeFromCart(itemId);
      await loadCart();
    });
  };

  const cartItems = cart?.cart_items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
  const deliveryFee = subtotal >= 150 ? 0 : 15;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'hosgeldin10') {
      setAppliedCoupon(couponCode);
    } else {
      alert('Geçersiz kupon kodu');
    }
    setCouponCode('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Henüz sepetinize ürün eklemediniz.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition"
          >
            <span>Alışverişe Başla</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sepetim</h1>
          <p className="text-gray-600">{cartItems.length} ürün</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-4 md:p-6">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.products.image_url}
                      alt={item.products.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link href={`/product/${item.products.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition">
                          {item.products.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                        disabled={isPending}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isPending}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isPending}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-xl font-bold text-orange-600">
                        ₺{(item.products.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kupon Kodu
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Kupon kodunuz"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
                  >
                    Uygula
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-emerald-600 text-sm mt-2">
                    ✓ &quot;{appliedCoupon}&quot; kuponu uygulandı
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Teslimat Ücreti</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600' : ''}>
                    {deliveryFee === 0 ? 'Ücretsiz' : `₺${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>İndirim</span>
                    <span>-₺{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Delivery Note */}
              {subtotal < 150 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-xl">
                  <p className="text-sm text-orange-700">
                    🚚 ₺{(150 - subtotal).toFixed(2)} daha ekleyin, ücretsiz teslimat kazanın!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition"
              >
                <span>Ödemeye Geç</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/menu"
                className="mt-3 w-full flex items-center justify-center text-gray-600 hover:text-orange-600 transition"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
