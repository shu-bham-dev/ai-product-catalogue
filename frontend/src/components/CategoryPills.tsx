import React from 'react';
import { Tag } from 'lucide-react';

interface CategoryPillsProps {
  categories: string[];
  activeCategory?: string;
  onSelectCategory: (category?: string) => void;
  showAllOption?: boolean;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  showAllOption = true,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {showAllOption && (
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            !activeCategory
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          All Products
        </button>
      )}

      {categories.map((cat) => {
        const isActive = activeCategory?.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-3 h-3 opacity-60" />
            {cat}
          </button>
        );
      })}
    </div>
  );
};
