import { useState, useEffect } from 'react';
import { Product } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { EnquiryModal } from './components/EnquiryModal';
import { ReviewerMailboxModal } from './components/ReviewerMailboxModal';
import { Heart, Github } from 'lucide-react';

type CurrentView =
  | { type: 'home' }
  | { type: 'category'; category: string }
  | { type: 'product'; productId: number }
  | { type: 'search'; query: string };

export function App() {
  const [view, setView] = useState<CurrentView>({ type: 'home' });
  const [enquiringProduct, setEnquiringProduct] = useState<Product | null>(null);
  const [isMailboxOpen, setIsMailboxOpen] = useState(false);
  const [mailboxRefreshKey, setMailboxRefreshKey] = useState(0);

  // Sync with browser URL / history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      if (path.startsWith('/category/')) {
        const cat = decodeURIComponent(path.replace('/category/', ''));
        setView({ type: 'category', category: cat });
      } else if (path.startsWith('/product/')) {
        const id = parseInt(path.replace('/product/', ''), 10);
        if (!isNaN(id)) {
          setView({ type: 'product', productId: id });
        }
      } else if (searchParams.has('q')) {
        setView({ type: 'search', query: searchParams.get('q') || '' });
      } else {
        setView({ type: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newView: CurrentView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let url = '/';
    if (newView.type === 'category') {
      url = `/category/${encodeURIComponent(newView.category)}`;
    } else if (newView.type === 'product') {
      url = `/product/${newView.productId}`;
    } else if (newView.type === 'search') {
      url = `/?q=${encodeURIComponent(newView.query)}`;
    }

    window.history.pushState({}, '', url);
  };

  const handleEnquirySuccess = () => {
    setMailboxRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Navigation */}
      <Navbar
        onNavigateHome={() => navigateTo({ type: 'home' })}
        onNavigateCategories={() => {
          // If on home, scroll to category section, else go to home
          if (view.type === 'home') {
            document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigateTo({ type: 'home' });
          }
        }}
        onNavigateFeatured={() => {
          if (view.type !== 'home') navigateTo({ type: 'home' });
          setTimeout(() => {
            document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSearch={(query) => {
          if (query.trim()) {
            navigateTo({ type: 'search', query: query.trim() });
          } else {
            navigateTo({ type: 'home' });
          }
        }}
        onOpenMailbox={() => setIsMailboxOpen(true)}
        mailboxUpdateTrigger={mailboxRefreshKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {view.type === 'home' && (
          <HomePage
            onSelectProduct={(id) => navigateTo({ type: 'product', productId: id })}
            onSelectCategory={(cat) => navigateTo({ type: 'category', category: cat })}
            onEnquireProduct={(prod) => setEnquiringProduct(prod)}
            onViewAllFeatured={() => {
              document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {view.type === 'category' && (
          <CategoryPage
            category={view.category}
            onBack={() => navigateTo({ type: 'home' })}
            onSelectProduct={(id) => navigateTo({ type: 'product', productId: id })}
            onSelectCategory={(cat) => navigateTo({ type: 'category', category: cat })}
            onEnquireProduct={(prod) => setEnquiringProduct(prod)}
          />
        )}

        {view.type === 'product' && (
          <ProductDetailPage
            productId={view.productId}
            onBack={() => navigateTo({ type: 'home' })}
            onSelectCategory={(cat) => navigateTo({ type: 'category', category: cat })}
            onEnquire={(prod) => setEnquiringProduct(prod)}
          />
        )}

        {view.type === 'search' && (
          <SearchResultsPage
            query={view.query}
            onSearch={(newQuery) => navigateTo({ type: 'search', query: newQuery })}
            onBack={() => navigateTo({ type: 'home' })}
            onSelectProduct={(id) => navigateTo({ type: 'product', productId: id })}
            onEnquireProduct={(prod) => setEnquiringProduct(prod)}
          />
        )}
      </main>

      {/* Enquiry Modal */}
      <EnquiryModal
        product={enquiringProduct}
        isOpen={!!enquiringProduct}
        onClose={() => setEnquiringProduct(null)}
        onSuccess={handleEnquirySuccess}
      />

      {/* Reviewer Mailbox Drawer / Modal */}
      <ReviewerMailboxModal
        isOpen={isMailboxOpen}
        onClose={() => setIsMailboxOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AuraStore</span>
            <span>&bull;</span>
            <span>AI-Native Software Engineering Assessment Solution</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> by Shubham Sahu
            </span>
            <span>&bull;</span>
            <button
              onClick={() => setIsMailboxOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Sales Mailbox Simulator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
