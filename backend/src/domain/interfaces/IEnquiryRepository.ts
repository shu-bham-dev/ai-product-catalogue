import { Enquiry, CreateEnquiryDTO } from '../entities/enquiry.js';

export interface IEnquiryRepository {
  create(dto: CreateEnquiryDTO): Promise<Enquiry>;
  getAll(): Promise<Enquiry[]>;
  getById(id: string): Promise<Enquiry | null>;
}
