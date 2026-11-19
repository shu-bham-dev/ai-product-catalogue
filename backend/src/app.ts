import express, { Express } from 'express';
import cors from 'cors';
import { IProductRepository } from './domain/interfaces/IProductRepository.js';
import { IEnquiryRepository } from './domain/interfaces/IEnquiryRepository.js';
import { IEmailService } from './domain/interfaces/IEmailService.js';
import { ProductService } from './application/services/productService.js';
import { EnquiryService } from './application/services/enquiryService.js';
import { ProductController } from './interfaces/http/controllers/productController.js';
import { EnquiryController } from './interfaces/http/controllers/enquiryController.js';
import { createProductRouter } from './interfaces/http/routes/productRoutes.js';
import { createCategoryRouter } from './interfaces/http/routes/categoryRoutes.js';
import { createEnquiryRouter } from './interfaces/http/routes/enquiryRoutes.js';

export interface AppDependencies {
  productRepository: IProductRepository;
  enquiryRepository: IEnquiryRepository;
  emailService: IEmailService;
  clientOrigin?: string;
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: deps.clientOrigin || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Services
  const productService = new ProductService(deps.productRepository);
  const enquiryService = new EnquiryService(
    deps.enquiryRepository,
    deps.productRepository,
    deps.emailService
  );

  // Controllers
  const productController = new ProductController(productService);
  const enquiryController = new EnquiryController(enquiryService);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API Routes
  app.use('/api/products', createProductRouter(productController));
  app.use('/api/categories', createCategoryRouter(productController));
  app.use('/api/enquiries', createEnquiryRouter(enquiryController));

  // 404 Handler
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  return app;
}
