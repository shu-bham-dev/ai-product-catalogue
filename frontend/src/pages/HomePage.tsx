import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import { CategoryPills } from '../components/CategoryPills';
import { Sparkles, ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface HomePageProps {
  onSelectProduct: (productId: number) => void;
  onSelectCategory: (category: string) => void;
  onEnquireProduct: (product: Product) => void;
  onViewAllFeatured: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onSelectCategory,
  onEnquireProduct,
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [featured, cats, products] = await Promise.all([
          api.getFeaturedProducts(),
          api.getCategories(),
          api.getProducts(),
        ]);
        setFeaturedProducts(featured);
        setCategories(cats);
        setAllProducts(products);
      } catch (err: any) {
        setError(err.message || 'Failed to load catalogue data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCategoryFilter = async (cat?: string) => {
    setActiveCategory(cat);
    try {
      const filtered = await api.getProducts({ category: cat });
      setAllProducts(filtered);
    } catch (err: any) {
      console.error('Filter error', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading product catalogue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-16 p-6 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
        <h3 className="text-base font-bold text-rose-700 mb-2">Unable to load catalogue</h3>
        <p className="text-xs text-slate-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Native Engineering Showcase &amp; Production Foundation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Curated Products for Modern Living
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Explore our curated catalogue across electronics, jewelry, and fashion.
            Submit instant product enquiries straight to our sales inbox.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Clean Architecture &amp; Repository Pattern</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Top Rated Product Algorithms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance Criteria:
          GIVEN I have chosen 5 products to be "top rated"
          WHEN I am viewing the home page
          THEN I see those 5 featured products */}
      <section id="featured-section" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Staff Picks &amp; High Satisfaction</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Top Rated Products (Featured 5)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top 5 customer-rated selections backed by verified reviews
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {featuredProducts.length} Featured Items
          </span>
        </div>

        {/* 5 Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featuredProducts.map((product) => (
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

      {/* Category Discovery Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Browse by Category</h3>
            <p className="text-xs text-slate-500">Explore dedicated category hubs with top-rated and additional collections</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all text-left group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Hub</span>
                <h4 className="text-sm font-bold text-slate-900 capitalize group-hover:text-blue-600 transition-colors">
                  {cat}
                </h4>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </section>

      {/* Full Catalogue Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Complete Product Catalogue</h3>
            <p className="text-xs text-slate-500">
              Showing {allProducts.length} products {activeCategory ? `in ${activeCategory}` : 'across all departments'}
            </p>
          </div>

          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategoryFilter}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onEnquire={onEnquireProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
