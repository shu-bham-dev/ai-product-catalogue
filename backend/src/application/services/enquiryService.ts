import { IEnquiryRepository } from '../../domain/interfaces/IEnquiryRepository.js';
import { IProductRepository } from '../../domain/interfaces/IProductRepository.js';
import { IEmailService, EmailRecord } from '../../domain/interfaces/IEmailService.js';
import { Enquiry, CreateEnquiryDTO } from '../../domain/entities/enquiry.js';

export interface SubmitEnquiryResult {
  enquiry: Enquiry;
  productTitle: string;
  emailDispatched: boolean;
  message: string;
}

export class EnquiryService {
  constructor(
    private enquiryRepository: IEnquiryRepository,
    private productRepository: IProductRepository,
    private emailService: IEmailService
  ) {}

  async submitEnquiry(dto: CreateEnquiryDTO): Promise<SubmitEnquiryResult> {
    // 1. Validation
    if (!dto.productId || typeof dto.productId !== 'number') {
      throw new Error('Valid productId is required');
    }
    if (!dto.customerName || !dto.customerName.trim() || dto.customerName.trim().length < 2) {
      throw new Error('Full name is required (minimum 2 characters)');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dto.customerEmail || !emailRegex.test(dto.customerEmail.trim())) {
      throw new Error('A valid email address is required');
    }
    if (!dto.message || !dto.message.trim() || dto.message.trim().length < 5) {
      throw new Error('Message is required (minimum 5 characters)');
    }

    // 2. Verify product existence
    const product = await this.productRepository.getById(dto.productId);
    if (!product) {
      throw new Error(`Product with ID ${dto.productId} not found`);
    }

    // 3. Persist enquiry
    const enquiry = await this.enquiryRepository.create(dto);

    // 4. Send email notification to sales inbox
    let emailDispatched = false;
    try {
      const emailResult = await this.emailService.sendEnquiryEmail(enquiry, product);
      emailDispatched = emailResult.success;
    } catch (err: any) {
      console.error(`[EnquiryService] Email dispatch failed: ${err.message}`);
    }

    return {
      enquiry,
      productTitle: product.title,
      emailDispatched,
      message: 'Thank you for your enquiry! Our sales team has received your message and will get back to you shortly.'
    };
  }

  async getAllEnquiries(): Promise<Enquiry[]> {
    return this.enquiryRepository.getAll();
  }

  async getSentEmails(): Promise<EmailRecord[]> {
    return this.emailService.getSentEmails();
  }
}
