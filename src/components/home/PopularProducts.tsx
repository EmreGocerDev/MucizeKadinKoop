import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPopularProducts } from '@/lib/actions/products';
import ProductCard from '@/components/ui/ProductCard';

export default async function PopularProducts() {
  const products = await getPopularProducts();

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Lezzetler</h2>
          <p className="text-gray-600">Henüz ürün eklenmemiş.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
              En Çok Tercih Edilenler
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Popüler Lezzetler
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl">
              Müşterilerimizin en çok beğendiği el yapımı lezzetleri keşfedin.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition group mt-4 md:mt-0"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
