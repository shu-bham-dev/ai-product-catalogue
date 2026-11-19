import { IEnquiryRepository } from '../../domain/interfaces/IEnquiryRepository.js';
import { Enquiry, CreateEnquiryDTO } from '../../domain/entities/enquiry.js';

export class MemoryEnquiryRepository implements IEnquiryRepository {
  private enquiries: Enquiry[] = [];

  async create(dto: CreateEnquiryDTO): Promise<Enquiry> {
    const enquiry: Enquiry = {
      id: `ENQ-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      productId: dto.productId,
      customerName: dto.customerName.trim(),
      customerEmail: dto.customerEmail.trim(),
      customerPhone: dto.customerPhone?.trim(),
      message: dto.message.trim(),
      createdAt: new Date().toISOString(),
      status: 'sent'
    };

    this.enquiries.unshift(enquiry);
    return { ...enquiry };
  }

  async getAll(): Promise<Enquiry[]> {
    return [...this.enquiries];
  }

  async getById(id: string): Promise<Enquiry | null> {
    const found = this.enquiries.find(e => e.id === id);
    return found ? { ...found } : null;
  }
}
