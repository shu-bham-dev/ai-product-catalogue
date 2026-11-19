import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  onSearch,
  placeholder = 'Search products, electronics, clothing...',
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <div className="relative w-full flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800 shadow-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};
