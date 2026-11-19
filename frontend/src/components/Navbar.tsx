import React, { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ShoppingBag, Inbox, Sparkles, Menu, X, Layers } from 'lucide-react';
import { api } from '../api/client';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateCategories: () => void;
  onNavigateFeatured: () => void;
  onSearch: (query: string) => void;
  onOpenMailbox: () => void;
  mailboxUpdateTrigger?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onNavigateCategories,
  onNavigateFeatured,
  onSearch,
  onOpenMailbox,
  mailboxUpdateTrigger = 0,
}) => {
  const [emailCount, setEmailCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.getSentEmails()
      .then((emails) => setEmailCount(emails.length))
      .catch(() => {});
  }, [mailboxUpdateTrigger]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-slate-900 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AuraStore
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-600 -mt-1">
                  AI-Native MVP
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <button
                onClick={onNavigateHome}
                className="px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                All Products
              </button>
              <button
                onClick={onNavigateFeatured}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Featured 5
              </button>
              <button
                onClick={onNavigateCategories}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Categories
              </button>
            </nav>
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Right actions: Reviewer Sales Inbox simulator */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMailbox}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:ring-2 hover:ring-slate-300"
              title="Open Sales Mailbox Simulator to inspect dispatched enquiry emails"
            >
              <Inbox className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Sales Mailbox</span>
              <span className="px-1.5 py-0.2 bg-blue-600 text-[10px] font-bold rounded-full">
                {emailCount}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3 animate-fadeIn">
            <SearchBar onSearch={(q) => { onSearch(q); setMobileMenuOpen(false); }} />
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-semibold">
              <button
                onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }}
                className="py-2 px-3 bg-slate-100 rounded-lg text-slate-800 text-center"
              >
                All Products
              </button>
              <button
                onClick={() => { onNavigateFeatured(); setMobileMenuOpen(false); }}
                className="py-2 px-3 bg-amber-50 text-amber-800 rounded-lg text-center"
              >
                Featured
              </button>
              <button
                onClick={() => { onNavigateCategories(); setMobileMenuOpen(false); }}
                className="py-2 px-3 bg-blue-50 text-blue-800 rounded-lg text-center"
              >
                Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
