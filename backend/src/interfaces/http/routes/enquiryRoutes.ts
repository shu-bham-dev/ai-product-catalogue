import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiryController.js';

export function createEnquiryRouter(controller: EnquiryController): Router {
  const router = Router();

  router.post('/', controller.submitEnquiry);
  router.get('/', controller.getAllEnquiries);
  router.get('/mailbox', controller.getSentEmails);

  return router;
}
