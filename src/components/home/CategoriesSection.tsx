import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/lib/actions/products';

export default async function CategoriesSection() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">
            Kategoriler
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Lezzet Dünyamızı Keşfedin
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            El yapımı ürünlerimizi kategorilere göre inceleyin.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative bg-gradient-to-br from-orange-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition group"
          >
            <span>Tüm Kategorileri Gör</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
