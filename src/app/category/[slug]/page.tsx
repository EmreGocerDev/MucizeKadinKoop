import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCategoryBySlug, getProducts, getCategories } from '@/lib/actions/products';
import ProductCard from '@/components/ui/ProductCard';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = await getProducts({ categoryId: category.id });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-600">Ana Sayfa</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/categories" className="text-gray-500 hover:text-orange-600">Kategoriler</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div 
        className="relative py-16 bg-gradient-to-r from-orange-500 to-emerald-500"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{categoryProducts.length}</span> ürün bulundu
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
