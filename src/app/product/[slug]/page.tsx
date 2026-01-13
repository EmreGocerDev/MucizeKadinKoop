import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, Clock, ChevronRight, ShoppingCart, Heart, 
  Share2, Minus, Plus, Check, AlertCircle 
} from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/actions/products';
import ProductCard from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Benzer ürünler (aynı kategori)
  const allProducts = await getProducts({ categoryId: product.category_id });
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-600">Ana Sayfa</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/menu" className="text-gray-500 hover:text-orange-600">Menü</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-md">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold">
                    Stokta Yok
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_available ? (
                  <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full font-medium">
                    Stokta
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                    Tükendi
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.review_count} değerlendirme)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-600">₺{product.price}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4">
              {product.preparation_time && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Hazırlık Süresi</p>
                    <p className="font-semibold text-gray-900">{product.preparation_time}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <Check className="h-6 w-6 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-500">Kalite</p>
                  <p className="font-semibold text-gray-900">El Yapımı</p>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Malzemeler</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.ingredients as string[]).map((ingredient: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Adet</span>
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">1</span>
                  <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={!product.is_available}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Sepete Ekle</span>
                </button>
                <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 transition">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Alerjen Bilgisi</p>
                <p className="text-amber-700 text-sm">
                  Bu ürün gluten, süt ürünleri veya yumurta içerebilir. 
                  Alerji durumunda lütfen satıcı ile iletişime geçin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
