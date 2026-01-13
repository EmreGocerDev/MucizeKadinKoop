import { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/actions/products';
import ProductCard from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

async function ProductsGrid({ categoryId, search }: { categoryId?: string; search?: string }) {
  const products = await getProducts({ categoryId, search });

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Ürün bulunamadı.</p>
        <Link href="/menu" className="text-orange-600 hover:underline mt-2 inline-block">
          Tüm ürünleri gör
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Menümüz</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El yapımı, taze ve lezzetli ürünlerimizi keşfedin.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link
            href="/menu"
            className={`px-4 py-2 rounded-full font-medium transition ${
              !params.category
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            Tümü
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className={`px-4 py-2 rounded-full font-medium transition ${
                params.category === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Products */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          }
        >
          <ProductsGrid categoryId={params.category} search={params.search} />
        </Suspense>
      </div>
    </div>
  );
}
