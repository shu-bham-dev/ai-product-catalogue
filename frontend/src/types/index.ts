export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CategoryBreakdown {
  category: string;
  topRated: Product[];
  additional: Product[];
  total: number;
}

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

export interface SubmitEnquiryResponse {
  enquiry: Enquiry;
  productTitle: string;
  emailDispatched: boolean;
  message: string;
}

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
