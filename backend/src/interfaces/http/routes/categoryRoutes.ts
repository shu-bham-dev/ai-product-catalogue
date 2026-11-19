import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

export function createCategoryRouter(controller: ProductController): Router {
  const router = Router();

  router.get('/', controller.getCategories);
  router.get('/:category', controller.getCategoryDetails);

  return router;
}
