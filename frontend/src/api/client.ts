import { Product, CategoryBreakdown, CreateEnquiryDTO, SubmitEnquiryResponse, EmailRecord } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: Failed request to ${path}`);
    }

    return res.json();
  }

  // Acceptance Criteria: Home page 5 top rated products
  async getFeaturedProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products/featured?limit=5');
  }

  // All products or filtered by search / category
  async getProducts(params?: { search?: string; category?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Product[]>(`/products${queryString}`);
  }

  // Acceptance Criteria: Product detail page
  async getProductById(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Acceptance Criteria: Categories list
  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

  // Acceptance Criteria: Category page (top rated + additional)
  async getCategoryDetails(category: string): Promise<CategoryBreakdown> {
    const encoded = encodeURIComponent(category);
    return this.request<CategoryBreakdown>(`/categories/${encoded}`);
  }

  // Acceptance Criteria: Search
  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/products?search=${encodeURIComponent(query)}`);
  }

  // Acceptance Criteria: Submit Enquiry
  async submitEnquiry(data: CreateEnquiryDTO): Promise<SubmitEnquiryResponse> {
    return this.request<SubmitEnquiryResponse>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reviewer tool: View emails sent to sales inbox
  async getSentEmails(): Promise<EmailRecord[]> {
    return this.request<EmailRecord[]>('/enquiries/mailbox');
  }
}

export const api = new ApiClient();
