import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../api/client';
import { RatingStars } from '../components/RatingStars';
import { ArrowLeft, Mail, ShieldCheck, Truck, Clock, RefreshCw, AlertCircle, Share2, Check } from 'lucide-react';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onEnquire: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onEnquire,
  onSelectCategory,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await api.getProductById(productId);
        setProduct(item);
      } catch (err: any) {
        setError(err.message || 'Product could not be retrieved');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-rose-800 mb-1">Product Not Found</h3>
        <p className="text-xs text-slate-600 mb-4">{error || 'The requested product is unavailable.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <span className="text-xs text-slate-300">/</span>
          <button
            onClick={() => onSelectCategory(product.category)}
            className="text-xs font-semibold text-blue-600 hover:underline capitalize"
          >
            {product.category}
          </button>
          <span className="text-xs text-slate-300">/</span>
          <span className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Main Product Card Detail */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">
        {/* Left: Product Image */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50/60 rounded-2xl border border-slate-100 min-h-[380px]">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[340px] max-w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Product Info & Enquiry CTA */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and SKU */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectCategory(product.category)}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors"
              >
                {product.category}
              </button>
              <span className="text-xs font-mono text-slate-400">SKU #{product.id.toString().padStart(4, '0')}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 py-2 border-y border-slate-100">
              <RatingStars rate={product.rating.rate} count={product.rating.count} size="md" />
              <span className="text-xs text-slate-400 font-medium">|</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Product
              </span>
            </div>

            {/* Price */}
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Retail Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">USD</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Callouts & Enquiry CTA */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            {/* Prominent Enquire Button */}
            <button
              onClick={() => onEnquire(product)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span>Enquire About This Product</span>
            </button>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-slate-600 text-xs">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Express courier dispatched worldwide</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Sales response guaranteed in 2 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
