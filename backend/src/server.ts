import { config } from './config/environment.js';
import { createApp } from './app.js';
import { FakeStoreProductRepository } from './infrastructure/repositories/fakeStoreProductRepository.js';
import { LocalProductRepository } from './infrastructure/repositories/localProductRepository.js';
import { MemoryEnquiryRepository } from './infrastructure/repositories/memoryEnquiryRepository.js';
import { MemoryEmailService } from './infrastructure/email/memoryEmailService.js';
import { ConsoleEmailService } from './infrastructure/email/consoleEmailService.js';
import { SmtpEmailService } from './infrastructure/email/smtpEmailService.js';
import { IProductRepository } from './domain/interfaces/IProductRepository.js';
import { IEmailService } from './domain/interfaces/IEmailService.js';

// Select Product Repository implementation
let productRepository: IProductRepository;
if (config.productDataSource === 'fakestore') {
  console.log(`[Config] Using FakeStoreProductRepository pointing to ${config.fakeStoreApiUrl}`);
  productRepository = new FakeStoreProductRepository(config.fakeStoreApiUrl);
} else {
  console.log(`[Config] Using LocalProductRepository`);
  productRepository = new LocalProductRepository();
}

// Select Email Service implementation
let emailService: IEmailService;
if (config.emailProvider === 'smtp') {
  console.log(`[Config] Using SmtpEmailService (${config.smtp.host}:${config.smtp.port})`);
  emailService = new SmtpEmailService({
    ...config.smtp,
    salesInboxEmail: config.salesInboxEmail
  });
} else if (config.emailProvider === 'console') {
  console.log(`[Config] Using ConsoleEmailService`);
  emailService = new ConsoleEmailService(config.salesInboxEmail);
} else {
  console.log(`[Config] Using MemoryEmailService (sales inbox: ${config.salesInboxEmail})`);
  emailService = new MemoryEmailService(config.salesInboxEmail);
}

// Enquiry Repository
const enquiryRepository = new MemoryEnquiryRepository();

// Initialize Express App
const app = createApp({
  productRepository,
  enquiryRepository,
  emailService,
  clientOrigin: config.clientOrigin
});

app.listen(config.port, () => {
  console.log(`
=====================================================
🚀 AI-Native Product Catalogue Backend running!
👉 Port:         ${config.port}
👉 Health:       http://localhost:${config.port}/api/health
👉 Products:     http://localhost:${config.port}/api/products
👉 Featured:     http://localhost:${config.port}/api/products/featured
👉 Categories:   http://localhost:${config.port}/api/categories
👉 Enquiries:    http://localhost:${config.port}/api/enquiries
👉 Mailbox:      http://localhost:${config.port}/api/enquiries/mailbox
=====================================================
  `);
});
