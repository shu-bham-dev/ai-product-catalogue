import { IProductRepository } from '../../domain/interfaces/IProductRepository.js';
import { Product } from '../../domain/entities/product.js';
import { DEFAULT_PRODUCTS } from './defaultProductsData.js';

export class LocalProductRepository implements IProductRepository {
  private products: Product[];

  constructor(initialData: Product[] = DEFAULT_PRODUCTS) {
    this.products = [...initialData];
  }

  async getAll(): Promise<Product[]> {
    return [...this.products];
  }

  async getById(id: number): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product ? { ...product } : null;
  }

  async getByCategory(category: string): Promise<Product[]> {
    const normalized = category.toLowerCase().trim();
    return this.products.filter(p => p.category.toLowerCase().trim() === normalized);
  }

  async getCategories(): Promise<string[]> {
    const categoriesSet = new Set<string>();
    this.products.forEach(p => categoriesSet.add(p.category));
    return Array.from(categoriesSet);
  }

  async getFeatured(limit = 5): Promise<Product[]> {
    // Top rated products: sorted by rating.rate desc, then count desc
    return [...this.products]
      .sort((a, b) => {
        if (b.rating.rate !== a.rating.rate) {
          return b.rating.rate - a.rating.rate;
        }
        return b.rating.count - a.rating.count;
      })
      .slice(0, limit);
  }

  async search(query: string): Promise<Product[]> {
    if (!query || !query.trim()) {
      return [...this.products];
    }
    const q = query.toLowerCase().trim();
    return this.products.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
}
