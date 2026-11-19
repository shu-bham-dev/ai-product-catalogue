import { IEmailService, EmailRecord, SendEmailResult } from '../../domain/interfaces/IEmailService.js';
import { Enquiry } from '../../domain/entities/enquiry.js';
import { Product } from '../../domain/entities/product.js';
import { MemoryEmailService } from './memoryEmailService.js';

export interface SmtpConfig {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  secure?: boolean;
  salesInboxEmail: string;
}

export class SmtpEmailService implements IEmailService {
  private config: SmtpConfig;
  private fallbackMemory: MemoryEmailService;

  constructor(config: SmtpConfig) {
    this.config = config;
    this.fallbackMemory = new MemoryEmailService(config.salesInboxEmail);
  }

  async sendEnquiryEmail(enquiry: Enquiry, product: Product): Promise<SendEmailResult> {
    console.log(`[SmtpEmailService] Sending enquiry ${enquiry.id} to SMTP ${this.config.host}:${this.config.port}`);
    // In production, instantiate nodemailer or aws-sdk SES client here.
    // For local dev and test environments, we reliably record in memory and log.
    return this.fallbackMemory.sendEnquiryEmail(enquiry, product);
  }

  async getSentEmails(): Promise<EmailRecord[]> {
    return this.fallbackMemory.getSentEmails();
  }
}
