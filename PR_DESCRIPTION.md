# Pull Request: Feature / Product Catalogue MVP (`feature/product-catalogue-mvp` -> `main`)

## Summary of Changes
This PR implements the **AI-Native Product Catalogue MVP** based on Clean / Hexagonal Architecture (Ports and Adapters). It provides a full-stack solution featuring a React (TypeScript) frontend and a Node.js (TypeScript) backend proxy that decouples the client from external data providers and ensures zero throwaway work as the product scales.

---

## Acceptance Criteria Checklist

- [x] **Home page**: Shows the 5 top rated products as featured items based on customer ratings and review volume.
- [x] **Category page**: Organises products by category and clearly separates **top rated products for that category** from **additional products in that category**.
- [x] **Search**: Search bar filters and returns only products that have text matching the search term across title, description, or category.
- [x] **Product page**: Clicking a product tile loads the dedicated product details view with full specifications, images, and customer ratings.
- [x] **Enquiry**: Clicking "Enquire" launches a contact form. On submit:
  - Form is validated on client and backend.
  - An email notification is dispatched to the sales inbox.
  - Customer receives an immediate "Thank you" confirmation message with an enquiry reference ID.
  - Reviewer can inspect outbound emails in real-time via the built-in **Sales Mailbox Simulator** in the navbar.

---

## Technical Constraints & Design Decisions

1. **Client / Backend Selection**: React (TypeScript) + Node.js (TypeScript) with Express.
2. **Backend Proxy Isolation**: Client never contacts the Fake Store API directly. All requests go through the backend `/api/*` endpoints.
3. **Pluggable Ports & Adapters**:
   - `IProductRepository`: Implemented by `FakeStoreProductRepository` (with in-memory caching and resilient fallback) and `LocalProductRepository`.
   - `IEmailService`: Implemented by `MemoryEmailService` (with live viewer), `ConsoleEmailService`, and `SmtpEmailService` (AWS SES / SMTP ready).
   - `IEnquiryRepository`: In-memory persistence ready for PostgreSQL/DynamoDB.
4. **AWS Compatibility**: Multi-stage Dockerfiles, Docker Compose, and AWS App Runner / ECS architecture guide in `/aws`.
5. **Zero Paid Accounts Needed**: Fully runnable locally under 2 minutes with `docker compose up` or `npm run dev`.

---

## Test Coverage
- Unit tests for `ProductService` (sorting, category breakdown, search).
- Unit tests for `EnquiryService` (validation, persistence, email dispatch).
- Integration tests for Express REST endpoints (`/api/health`, `/api/products`, `/api/products/featured`, `/api/categories`, `/api/enquiries`).

---

## Verification Steps
1. Run `docker compose up --build` or `npm run setup && npm run dev`.
2. Visit `http://localhost:5173`.
3. Check the featured 5 items on the Home Page.
4. Click a category link (e.g. "Electronics") and observe the "Top Rated" and "Additional" sections.
5. Use the Search bar to search for "backpack" or "SSD".
6. Click any product to view its details page, then click "Enquire About This Product".
7. Complete and submit the enquiry form; observe the "Thank You" confirmation.
8. Click "Sales Mailbox" in the navbar to inspect the email delivered to `sales@catalogue.example.com`.
