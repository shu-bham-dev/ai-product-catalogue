import { IEmailService, EmailRecord, SendEmailResult } from '../../domain/interfaces/IEmailService.js';
import { Enquiry } from '../../domain/entities/enquiry.js';
import { Product } from '../../domain/entities/product.js';

export class ConsoleEmailService implements IEmailService {
  private sentEmails: EmailRecord[] = [];
  private salesInboxEmail: string;

  constructor(salesInboxEmail: string = 'sales@catalogue.example.com') {
    this.salesInboxEmail = salesInboxEmail;
  }

  async sendEnquiryEmail(enquiry: Enquiry, product: Product): Promise<SendEmailResult> {
    const emailId = `MSG-${Date.now()}`;
    const subject = `[New Product Enquiry] #${enquiry.id}: ${product.title}`;

    const text = `
------------------------------------------------------------
[OUTBOUND SALES EMAIL DISPATCH]
To:       ${this.salesInboxEmail}
Subject:  ${subject}
Product:  #${product.id} - ${product.title} ($${product.price})
Customer: ${enquiry.customerName} <${enquiry.customerEmail}> (${enquiry.customerPhone || 'no phone'})
Message:  ${enquiry.message}
------------------------------------------------------------
    `.trim();

    console.log(text);

    const record: EmailRecord = {
      id: emailId,
      to: this.salesInboxEmail,
      from: 'catalogue-bot@example.com',
      subject,
      text,
      html: `<pre>${text}</pre>`,
      timestamp: new Date().toISOString(),
      enquiryId: enquiry.id,
      productTitle: product.title
    };

    this.sentEmails.unshift(record);
    return { success: true, messageId: emailId };
  }

  async getSentEmails(): Promise<EmailRecord[]> {
    return [...this.sentEmails];
  }
}
