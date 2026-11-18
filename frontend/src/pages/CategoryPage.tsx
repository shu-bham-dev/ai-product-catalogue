import React, { useState, useEffect } from 'react';
import { Product, CategoryBreakdown } from '../types';
import { api } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowLeft, Layers, RefreshCw, AlertCircle } from 'lucide-react';

interface CategoryPageProps {
  category: string;
  onBack: () => void;
  onSelectProduct: (productId: number) => void;
  onSelectCategory: (category: string) => void;
  onEnquireProduct: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  onBack,
  onSelectProduct,
  onSelectCategory,
  onEnquireProduct,
}) => {
  const [data, setData] = useState<CategoryBreakdown | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const [details, allCats] = await Promise.all([
          api.getCategoryDetails(category),
          api.getCategories(),
        ]);
        setData(details);
        setCategories(allCats);
      } catch (err: any) {
        setError(err.message || 'Failed to load category products');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading {category} products...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-rose-800 mb-1">Category Not Found</h3>
        <p className="text-xs text-slate-600 mb-4">{error || 'No products available'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <span className="text-xs text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-800 capitalize">{category}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Layers className="w-4 h-4" />
              <span>Category Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 capitalize">
              {category}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {data.total} total products ({data.topRated.length} top rated, {data.additional.length} additional)
            </p>
          </div>

          {/* Quick other categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onSelectCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  c.toLowerCase() === category.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Acceptance Criteria:
          THEN I see top rated products for that category */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Top Rated in {category}
            </h2>
            <p className="text-xs text-slate-500">
              Highest scoring items based on customer reviews in this category
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.topRated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFeatured={true}
              onSelect={onSelectProduct}
              onEnquire={onEnquireProduct}
            />
          ))}
        </div>
      </section>

      {/* Acceptance Criteria:
          AND I see additional products in that category */}
      {data.additional.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Additional Products in {category}
            </h3>
            <p className="text-xs text-slate-500">
              More selections available in this department
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.additional.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFeatured={false}
                onSelect={onSelectProduct}
                onEnquire={onEnquireProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
