import { Request, Response } from 'express';
import { ProductService } from '../../../application/services/productService.js';

export class ProductController {
  constructor(private productService: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const featured = req.query.featured as string | undefined;

      if (featured === 'true') {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
        const products = await this.productService.getFeaturedProducts(limit);
        res.json(products);
        return;
      }

      const products = await this.productService.getAllProducts({ search, category });
      res.json(products);
    } catch (err: any) {
      console.error('[ProductController.getAll] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  };

  getFeatured = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const products = await this.productService.getFeaturedProducts(limit);
      res.json(products);
    } catch (err: any) {
      console.error('[ProductController.getFeatured] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve featured products' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const product = await this.productService.getProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (err: any) {
      console.error('[ProductController.getById] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve product' });
    }
  };

  getCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.productService.getCategories();
      res.json(categories);
    } catch (err: any) {
      console.error('[ProductController.getCategories] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  };

  getCategoryDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = decodeURIComponent(req.params.category);
      const details = await this.productService.getCategoryDetails(category);
      if (!details) {
        res.status(404).json({ error: `Category '${category}' not found or has no products` });
        return;
      }
      res.json(details);
    } catch (err: any) {
      console.error('[ProductController.getCategoryDetails] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve category details' });
    }
  };
}
