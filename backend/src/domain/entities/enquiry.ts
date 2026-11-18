export interface Enquiry {
  id: string;
  productId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface CreateEnquiryDTO {
  productId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
}
