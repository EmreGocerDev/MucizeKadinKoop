'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { addToCart } from '@/lib/actions/cart';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { incrementCart, showNotification } = useCart();
  const isAvailable = (product.stock_quantity || 0) > 0 && product.is_active !== false;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const result = await addToCart(product.id, 1);
      setIsAdding(false);
      
      if (result?.success) {
        incrementCart();
        showNotification(`${product.name} sepete eklendi!`);
      } else if (result?.error) {
        showNotification(result.error);
      } else {
        console.error('Beklenmeyen sonuç:', result);
        showNotification('Bir hata oluştu, lütfen tekrar deneyin');
      }
    } catch (error) {
      setIsAdding(false);
      console.error('Sepete ekleme hatası:', error);
      showNotification('Bir hata oluştu, lütfen tekrar deneyin');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative h-48 overflow-hidden bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {isAvailable ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Stokta
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Tükendi
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Öne Çıkan
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories && (
          <span className="text-xs text-orange-600 font-medium">
            {product.categories.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-2xl font-bold text-orange-600">₺{product.price}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isAvailable || isAdding}
          >
            {isAdding ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">Sepete Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
