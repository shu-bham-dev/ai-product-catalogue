import { describe, it, expect, beforeEach } from 'vitest';
import { EnquiryService } from '../../src/application/services/enquiryService.js';
import { MemoryEnquiryRepository } from '../../src/infrastructure/repositories/memoryEnquiryRepository.js';
import { LocalProductRepository } from '../../src/infrastructure/repositories/localProductRepository.js';
import { MemoryEmailService } from '../../src/infrastructure/email/memoryEmailService.js';

describe('EnquiryService', () => {
  let enquiryRepo: MemoryEnquiryRepository;
  let productRepo: LocalProductRepository;
  let emailService: MemoryEmailService;
  let service: EnquiryService;

  beforeEach(() => {
    enquiryRepo = new MemoryEnquiryRepository();
    productRepo = new LocalProductRepository([
      { id: 101, title: 'Test Product', price: 99.99, description: 'Test', category: 'test', image: '', rating: { rate: 4.8, count: 10 } }
    ]);
    emailService = new MemoryEmailService('sales@test.com');
    service = new EnquiryService(enquiryRepo, productRepo, emailService);
  });

  it('successfully creates enquiry and dispatches email notification', async () => {
    const result = await service.submitEnquiry({
      productId: 101,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      customerPhone: '+1-555-0199',
      message: 'I am interested in bulk purchasing this product.'
    });

    expect(result.enquiry.id).toMatch(/^ENQ-/);
    expect(result.productTitle).toBe('Test Product');
    expect(result.emailDispatched).toBe(true);
    expect(result.message).toContain('Thank you for your enquiry');

    const sentEmails = await emailService.getSentEmails();
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0].to).toBe('sales@test.com');
    expect(sentEmails[0].text).toContain('Jane Doe');
    expect(sentEmails[0].text).toContain('Test Product');
  });

  it('rejects invalid email formats', async () => {
    await expect(service.submitEnquiry({
      productId: 101,
      customerName: 'Jane Doe',
      customerEmail: 'invalid-email',
      message: 'Hello there'
    })).rejects.toThrow('A valid email address is required');
  });

  it('rejects non-existent product ID', async () => {
    await expect(service.submitEnquiry({
      productId: 99999,
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      message: 'Hello there'
    })).rejects.toThrow('Product with ID 99999 not found');
  });
});
