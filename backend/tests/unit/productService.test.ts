import { describe, it, expect, beforeEach } from 'vitest';
import { ProductService } from '../../src/application/services/productService.js';
import { LocalProductRepository } from '../../src/infrastructure/repositories/localProductRepository.js';
import { Product } from '../../src/domain/entities/product.js';

describe('ProductService', () => {
  let sampleProducts: Product[];
  let repo: LocalProductRepository;
  let service: ProductService;

  beforeEach(() => {
    sampleProducts = [
      { id: 1, title: 'Item 1', price: 10, description: 'Desc 1', category: 'cat1', image: '', rating: { rate: 4.9, count: 100 } },
      { id: 2, title: 'Item 2', price: 20, description: 'Desc 2', category: 'cat1', image: '', rating: { rate: 4.8, count: 50 } },
      { id: 3, title: 'Item 3', price: 30, description: 'Desc 3', category: 'cat2', image: '', rating: { rate: 4.7, count: 80 } },
      { id: 4, title: 'Item 4', price: 40, description: 'Desc 4', category: 'cat2', image: '', rating: { rate: 4.6, count: 90 } },
      { id: 5, title: 'Item 5', price: 50, description: 'Desc 5', category: 'cat2', image: '', rating: { rate: 4.5, count: 30 } },
      { id: 6, title: 'Item 6', price: 60, description: 'Desc 6', category: 'cat2', image: '', rating: { rate: 3.5, count: 10 } },
    ];
    repo = new LocalProductRepository(sampleProducts);
    service = new ProductService(repo);
  });

  it('retrieves exactly 5 top rated featured products in descending order', async () => {
    const featured = await service.getFeaturedProducts(5);
    expect(featured).toHaveLength(5);
    expect(featured[0].id).toBe(1); // 4.9
    expect(featured[1].id).toBe(2); // 4.8
    expect(featured[2].id).toBe(3); // 4.7
    expect(featured[3].id).toBe(4); // 4.6
    expect(featured[4].id).toBe(5); // 4.5
  });

  it('breaks down category into topRated and additional products', async () => {
    const details = await service.getCategoryDetails('cat2');
    expect(details).not.toBeNull();
    expect(details?.category).toBe('cat2');
    expect(details?.topRated.length).toBeGreaterThan(0);
    expect(details?.additional.length).toBeGreaterThan(0);
    expect(details?.total).toBe(4);

    // Verify top rated has highest rating
    const topRates = details!.topRated.map(p => p.rating.rate);
    const additionalRates = details!.additional.map(p => p.rating.rate);
    expect(Math.min(...topRates)).toBeGreaterThanOrEqual(Math.max(...additionalRates));
  });

  it('searches products by text matching title or description', async () => {
    const results = await service.searchProducts('Item 3');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(3);
  });
});
