import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { LocalProductRepository } from '../../src/infrastructure/repositories/localProductRepository.js';
import { MemoryEnquiryRepository } from '../../src/infrastructure/repositories/memoryEnquiryRepository.js';
import { MemoryEmailService } from '../../src/infrastructure/email/memoryEmailService.js';
import { DEFAULT_PRODUCTS } from '../../src/infrastructure/repositories/defaultProductsData.js';

describe('Backend API Integration Tests', () => {
  let app: any;
  let emailService: MemoryEmailService;

  beforeEach(() => {
    const productRepo = new LocalProductRepository(DEFAULT_PRODUCTS);
    const enquiryRepo = new MemoryEnquiryRepository();
    emailService = new MemoryEmailService('sales@test.com');
    app = createApp({
      productRepository: productRepo,
      enquiryRepository: enquiryRepo,
      emailService
    });
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/products/featured returns exactly 5 featured products', async () => {
    const res = await request(app).get('/api/products/featured');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(5);
    // Highest rating first
    expect(res.body[0].rating.rate).toBeGreaterThanOrEqual(res.body[1].rating.rate);
  });

  it('GET /api/products?search=backpack filters matching products', async () => {
    const res = await request(app).get('/api/products?search=backpack');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((p: any) => {
      const match = p.title.toLowerCase().includes('backpack') || 
                    p.description.toLowerCase().includes('backpack') ||
                    p.category.toLowerCase().includes('backpack');
      expect(match).toBe(true);
    });
  });

  it('GET /api/categories returns category list', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toContain('electronics');
    expect(res.body).toContain("men's clothing");
  });

  it('GET /api/categories/electronics returns topRated and additional', async () => {
    const res = await request(app).get('/api/categories/electronics');
    expect(res.status).toBe(200);
    expect(res.body.category).toBe('electronics');
    expect(Array.isArray(res.body.topRated)).toBe(true);
    expect(Array.isArray(res.body.additional)).toBe(true);
    expect(res.body.topRated.length).toBeGreaterThan(0);
    expect(res.body.additional.length).toBeGreaterThan(0);
  });

  it('POST /api/enquiries submits enquiry and notifies sales mailbox', async () => {
    const payload = {
      productId: 1,
      customerName: 'Alice Johnson',
      customerEmail: 'alice@example.com',
      customerPhone: '+1-234-567-8901',
      message: 'Can you provide wholesale pricing for 50 units?'
    };

    const res = await request(app).post('/api/enquiries').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.emailDispatched).toBe(true);
    expect(res.body.message).toContain('Thank you');

    const mailboxRes = await request(app).get('/api/enquiries/mailbox');
    expect(mailboxRes.status).toBe(200);
    expect(mailboxRes.body.length).toBe(1);
    expect(mailboxRes.body[0].to).toBe('sales@test.com');
  });
});
