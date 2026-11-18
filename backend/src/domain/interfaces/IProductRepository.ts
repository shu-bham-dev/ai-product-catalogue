import { Product } from '../entities/product.js';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getByCategory(category: string): Promise<Product[]>;
  getCategories(): Promise<string[]>;
  getFeatured(limit?: number): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}
