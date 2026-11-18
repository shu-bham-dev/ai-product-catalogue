import { IProductRepository } from '../../domain/interfaces/IProductRepository.js';
import { Product } from '../../domain/entities/product.js';

export interface CategoryBreakdown {
  category: string;
  topRated: Product[];
  additional: Product[];
  total: number;
}

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(filters?: { search?: string; category?: string }): Promise<Product[]> {
    if (filters?.search) {
      return this.productRepository.search(filters.search);
    }
    if (filters?.category) {
      return this.productRepository.getByCategory(filters.category);
    }
    return this.productRepository.getAll();
  }

  async getFeaturedProducts(limit: number = 5): Promise<Product[]> {
    return this.productRepository.getFeatured(limit);
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.getById(id);
  }

  async getCategories(): Promise<string[]> {
    return this.productRepository.getCategories();
  }

  async getCategoryDetails(categoryName: string): Promise<CategoryBreakdown | null> {
    const products = await this.productRepository.getByCategory(categoryName);
    if (!products || products.length === 0) {
      return null;
    }

    // Sort by rating descending
    const sorted = [...products].sort((a, b) => {
      if (b.rating.rate !== a.rating.rate) {
        return b.rating.rate - a.rating.rate;
      }
      return b.rating.count - a.rating.count;
    });

    // We define "top rated products for that category" as either products with rate >= 4.5
    // or the top 1/3 (at least 1, up to 2 items if small category, or up to 3 items)
    const thresholdRating = 4.5;
    let topRated = sorted.filter(p => p.rating.rate >= thresholdRating);

    // If no product meets 4.5 threshold, pick top 1 or top 2
    if (topRated.length === 0) {
      topRated = sorted.slice(0, 1);
    } else if (topRated.length >= sorted.length && sorted.length > 1) {
      // Ensure there are also additional products
      topRated = sorted.slice(0, Math.ceil(sorted.length / 2));
    }

    const topRatedIds = new Set(topRated.map(p => p.id));
    const additional = sorted.filter(p => !topRatedIds.has(p.id));

    return {
      category: categoryName,
      topRated,
      additional,
      total: products.length
    };
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productRepository.search(query);
  }
}
