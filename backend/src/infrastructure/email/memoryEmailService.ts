import { IEmailService, EmailRecord, SendEmailResult } from '../../domain/interfaces/IEmailService.js';
import { Enquiry } from '../../domain/entities/enquiry.js';
import { Product } from '../../domain/entities/product.js';

export class MemoryEmailService implements IEmailService {
  private sentEmails: EmailRecord[] = [];
  private salesInboxEmail: string;

  constructor(salesInboxEmail: string = 'sales@catalogue.example.com') {
    this.salesInboxEmail = salesInboxEmail;
  }

  async sendEnquiryEmail(enquiry: Enquiry, product: Product): Promise<SendEmailResult> {
    const emailId = `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const subject = `[New Product Enquiry] #${enquiry.id}: ${product.title}`;

    const text = `
========================================
NEW PRODUCT ENQUIRY RECEIVED
========================================
Enquiry ID:    ${enquiry.id}
Date:          ${enquiry.createdAt}

CUSTOMER DETAILS:
Name:          ${enquiry.customerName}
Email:         ${enquiry.customerEmail}
Phone:         ${enquiry.customerPhone || 'Not provided'}

PRODUCT INTERESTED IN:
Product ID:    ${product.id}
Title:         ${product.title}
Category:      ${product.category}
Price:         $${product.price.toFixed(2)}
Rating:        ${product.rating.rate} / 5 (${product.rating.count} reviews)

CUSTOMER MESSAGE:
${enquiry.message}
========================================
    `.trim();

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">New Customer Enquiry</h2>
  <p><strong>Enquiry Reference:</strong> ${enquiry.id}</p>
  <p><strong>Date:</strong> ${new Date(enquiry.createdAt).toLocaleString()}</p>
  
  <h3 style="color: #2563eb; margin-top: 20px;">Customer Information</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Name:</strong></td><td>${enquiry.customerName}</td></tr>
    <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td><a href="mailto:${enquiry.customerEmail}">${enquiry.customerEmail}</a></td></tr>
    <tr><td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td><td>${enquiry.customerPhone || 'N/A'}</td></tr>
  </table>

  <h3 style="color: #2563eb; margin-top: 20px;">Product Details</h3>
  <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px;">
    <p style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold;">${product.title}</p>
    <p style="margin: 0 0 6px 0; color: #64748b;">Category: ${product.category} | SKU #${product.id}</p>
    <p style="margin: 0; font-size: 18px; color: #059669; font-weight: bold;">$${product.price.toFixed(2)}</p>
  </div>

  <h3 style="color: #2563eb; margin-top: 20px;">Customer Message</h3>
  <div style="background: #ffffff; border-left: 4px solid #3b82f6; padding: 12px 16px; font-style: italic;">
    ${enquiry.message.replace(/\n/g, '<br/>')}
  </div>
</div>
    `.trim();

    const emailRecord: EmailRecord = {
      id: emailId,
      to: this.salesInboxEmail,
      from: `catalogue-bot@example.com`,
      subject,
      text,
      html,
      timestamp: new Date().toISOString(),
      enquiryId: enquiry.id,
      productTitle: product.title
    };

    this.sentEmails.unshift(emailRecord);
    console.log(`[MemoryEmailService] Dispatched email ${emailId} to ${this.salesInboxEmail} for enquiry ${enquiry.id}`);

    return {
      success: true,
      messageId: emailId
    };
  }

  async getSentEmails(): Promise<EmailRecord[]> {
    return [...this.sentEmails];
  }
}
