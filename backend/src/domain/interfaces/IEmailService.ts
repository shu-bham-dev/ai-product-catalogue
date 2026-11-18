import { Enquiry } from '../entities/enquiry.js';
import { Product } from '../entities/product.js';

export interface EmailRecord {
  id: string;
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
  timestamp: string;
  enquiryId: string;
  productTitle: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IEmailService {
  sendEnquiryEmail(enquiry: Enquiry, product: Product): Promise<SendEmailResult>;
  getSentEmails(): Promise<EmailRecord[]>;
}
