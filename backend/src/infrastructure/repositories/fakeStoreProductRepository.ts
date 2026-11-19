import { IProductRepository } from '../../domain/interfaces/IProductRepository.js';
import { Product } from '../../domain/entities/product.js';
import { LocalProductRepository } from './localProductRepository.js';

export class FakeStoreProductRepository implements IProductRepository {
  private baseUrl: string;
  private fallbackRepo: LocalProductRepository;
  private cachedProducts: Product[] | null = null;
  private cacheExpiresAt: number = 0;
  private cacheTtlMs: number = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string = 'https://fakestoreapi.com') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.fallbackRepo = new LocalProductRepository();
  }

  private async fetchFromApi<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Fake Store API returned HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`[FakeStoreProductRepository] Request to ${url} failed: ${err.message}. Using resilient fallback.`);
      throw err;
    }
  }

  async getAll(): Promise<Product[]> {
    const now = Date.now();
    if (this.cachedProducts && this.cacheExpiresAt > now) {
      return [...this.cachedProducts];
    }

    try {
      const products = await this.fetchFromApi<Product[]>('/products');
      this.cachedProducts = products;
      this.cacheExpiresAt = now + this.cacheTtlMs;
      return [...products];
    } catch {
      // Resilient fallback to local default products
      return this.fallbackRepo.getAll();
    }
  }

  async getById(id: number): Promise<Product | null> {
    // If cached, try cache first
    if (this.cachedProducts) {
      const cached = this.cachedProducts.find(p => p.id === id);
      if (cached) return { ...cached };
    }

    try {
      const product = await this.fetchFromApi<Product>(`/products/${id}`);
      return product || null;
    } catch {
      return this.fallbackRepo.getById(id);
    }
  }

  async getByCategory(category: string): Promise<Product[]> {
    try {
      const encoded = encodeURIComponent(category);
      const products = await this.fetchFromApi<Product[]>(`/products/category/${encoded}`);
      return products;
    } catch {
      return this.fallbackRepo.getByCategory(category);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const categories = await this.fetchFromApi<string[]>('/products/categories');
      return categories;
    } catch {
      return this.fallbackRepo.getCategories();
    }
  }

  async getFeatured(limit = 5): Promise<Product[]> {
    const all = await this.getAll();
    return [...all]
      .sort((a, b) => {
        if (b.rating.rate !== a.rating.rate) {
          return b.rating.rate - a.rating.rate;
        }
        return b.rating.count - a.rating.count;
      })
      .slice(0, limit);
  }

  async search(query: string): Promise<Product[]> {
    const all = await this.getAll();
    if (!query || !query.trim()) {
      return all;
    }
    const q = query.toLowerCase().trim();
    return all.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
}
