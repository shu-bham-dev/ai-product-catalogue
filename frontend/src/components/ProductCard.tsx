import React from 'react';
import { Product } from '../types';
import { RatingStars } from './RatingStars';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: number) => void;
  onEnquire: (product: Product) => void;
  isFeatured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onEnquire,
  isFeatured = false,
}) => {
  return (
    <div
      onClick={() => onSelect(product.id)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 ${
        isFeatured
          ? 'border-blue-200/80 shadow-md ring-1 ring-blue-500/10'
          : 'border-slate-200/80 shadow-sm hover:border-slate-300'
      }`}
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide text-slate-700 shadow-sm border border-slate-100 uppercase">
          {product.category}
        </span>
        {isFeatured && (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[11px] font-bold shadow-sm">
            <Sparkles className="w-3 h-3" />
            Top Rated
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative pt-[85%] w-full bg-white p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="mb-2">
            <RatingStars rate={product.rating.rate} count={product.rating.count} size="sm" />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Short description preview */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onEnquire(product)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
              title="Submit an enquiry for this product"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </button>
            <button
              type="button"
              onClick={() => onSelect(product.id)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="View details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
