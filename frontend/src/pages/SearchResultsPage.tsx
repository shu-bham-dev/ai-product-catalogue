import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api/client';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { Search, ArrowLeft, RefreshCw, Frown } from 'lucide-react';

interface SearchResultsPageProps {
  query: string;
  onSearch: (newQuery: string) => void;
  onBack: () => void;
  onSelectProduct: (productId: number) => void;
  onEnquireProduct: (product: Product) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  onSearch,
  onBack,
  onSelectProduct,
  onEnquireProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const executeSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await api.searchProducts(query);
        setProducts(results);
      } catch (err: any) {
        setError(err.message || 'Search execution failed');
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [query]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Search control */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </button>

        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Search className="w-4 h-4" />
                <span>Search Results</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                "{query}"
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Showing products with text matching your search terms in title, description, or category
              </p>
            </div>

            <span className="self-start sm:self-auto px-3.5 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
              {loading ? 'Searching...' : `${products.length} matched products`}
            </span>
          </div>

          <SearchBar initialQuery={query} onSearch={onSearch} />
        </div>
      </div>

      {/* Results content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Searching matching products...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto my-8 p-6 bg-white border border-rose-200 rounded-2xl text-center">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <Frown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1">
              We couldn't find any products matching "{query}". Try checking for spelling errors or searching for broader terms like "SSD", "jacket", or "backpack".
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Clear Search &amp; View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onEnquire={onEnquireProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
