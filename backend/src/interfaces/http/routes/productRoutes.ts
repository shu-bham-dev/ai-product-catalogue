import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  router.get('/featured', controller.getFeatured);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);

  return router;
}
