import { Request, Response } from 'express';
import { EnquiryService } from '../../../application/services/enquiryService.js';

export class EnquiryController {
  constructor(private enquiryService: EnquiryService) {}

  submitEnquiry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, customerName, customerEmail, customerPhone, message } = req.body;

      const result = await this.enquiryService.submitEnquiry({
        productId: Number(productId),
        customerName,
        customerEmail,
        customerPhone,
        message
      });

      res.status(201).json(result);
    } catch (err: any) {
      console.warn('[EnquiryController.submitEnquiry] Bad request:', err.message);
      res.status(400).json({ error: err.message || 'Failed to submit enquiry' });
    }
  };

  getAllEnquiries = async (_req: Request, res: Response): Promise<void> => {
    try {
      const enquiries = await this.enquiryService.getAllEnquiries();
      res.json(enquiries);
    } catch (err: any) {
      console.error('[EnquiryController.getAllEnquiries] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve enquiries' });
    }
  };

  getSentEmails = async (_req: Request, res: Response): Promise<void> => {
    try {
      const emails = await this.enquiryService.getSentEmails();
      res.json(emails);
    } catch (err: any) {
      console.error('[EnquiryController.getSentEmails] Error:', err);
      res.status(500).json({ error: 'Failed to retrieve sent emails' });
    }
  };
}
