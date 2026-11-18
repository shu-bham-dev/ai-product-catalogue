# Decisions & Assumptions

This document outlines the architectural decisions, assumptions, trade-offs, and future roadmap for the **AI-Native Product Catalogue MVP**.

---

## 1. Assumptions Made Where Acceptance Criteria Were Unclear

### 1.1 "Top Rated" Selection Criteria (Home Page & Category Page)
- **Home Page**: The acceptance criteria state:
  > *GIVEN I have chosen 5 products to be "top rated" WHEN I am viewing the home page THEN I see those 5 featured products*
  - **Assumption**: A product's "top rated" status is determined algorithmically by sorting on `rating.rate` descending, with `rating.count` (review volume) as a secondary tie-breaker. The top 5 highest-rated products across the entire catalogue are dynamically served as the featured 5. The backend also supports configurable curated product IDs should editorial overrides be required.
- **Category Page**: The acceptance criteria state:
  > *WHEN I click on a category link THEN I see top rated products for that category AND I see additional products in that category*
  - **Assumption**: Within a category, products with a `rating.rate >= 4.5` are partitioned into the "Top Rated in {Category}" section. Remaining products in that category are presented under "Additional Products in {Category}". If all or none of the products meet the 4.5 threshold, the highest-rated 50% are allocated to "Top Rated" and the rest to "Additional", guaranteeing that both sections are populated.

### 1.2 Enquiry Email Delivery & Sales Inbox Verification
- The criteria state:
  > *WHEN I submit the form THEN the sales inbox will receive an email AND the customer will see a "Thank you" message*
  - **Technical Constraint #6**: *Your solution must not depend on paid services or accounts the reviewer would need to create.*
  - **Assumption**: Requiring reviewers to configure AWS SES credentials or third-party SMTP accounts would violate constraint #6 and break the "run under 10 minutes" rule.
  - **Decision**: Implemented a **Pluggable Hexagonal Email Architecture (`IEmailService`)**:
    1. **`MemoryEmailService` (Default)**: Dispatches the email in memory and exposes a live **"Sales Mailbox Simulator"** right inside the frontend navigation bar and at `GET /api/enquiries/mailbox`. The reviewer can submit an enquiry and immediately click "Sales Mailbox" to see the full email delivered with headers, recipient, subject, and body!
    2. **`ConsoleEmailService`**: Logs formatted email dispatch banners directly to stdout.
    3. **`SmtpEmailService`**: Seamlessly integrates with real SMTP, Mailpit, or AWS SES by toggling environment variables.

### 1.3 External API Reliability & Sandbox Isolation
- Fake Store API is a public third-party demo API that is occasionally unreachable, rate-limited, or blocked by restricted network sandboxes.
- **Decision**: Implemented an in-memory TTL cache (5-minute TTL) and an automated fallback inside `FakeStoreProductRepository`. If Fake Store API fails or times out (4s timeout), the repository gracefully falls back to bundled default data, ensuring the reviewer experience is 100% resilient and never blocked by external downtime.

### 1.4 Search Matching Scope
- **Assumption**: Search queries match case-insensitively against the product `title`, `description`, and `category`. Only products matching the search query are returned.

---

## 2. Requirements Dropped or Simplified (and Why)

1. **User Authentication & Accounts (Simplified Out)**:
   - *Why*: The MVP's core objective is to validate customer interest and capture product enquiries with minimal friction. Requiring registration or sign-in before browsing or enquiring increases abandonment without adding validation value.
2. **Shopping Cart & Checkout / Payment Gateway (Dropped)**:
   - *Why*: The client requested an enquiry-driven catalogue model to firm up product vision before introducing payment and inventory logistics. Replacing checkout with an enquiry submission aligns directly with the MVP scope.
3. **Persistent Database (Simplified to In-Memory with Repository Abstraction)**:
   - *Why*: Setting up and running PostgreSQL/MySQL locally requires extra database migration steps and potential port conflicts on reviewer machines. By using `MemoryEnquiryRepository` adhering to `IEnquiryRepository`, the app runs instantly in zero setup steps, while remaining trivial to swap to PostgreSQL/Prisma in production.

---

## 3. How the Design Supports Growing Beyond the PoC

The entrepreneur was explicitly concerned about "throwaway prototypes" and requested a foundation that can grow with their vision. The codebase solves this using **Hexagonal / Clean Architecture (Ports and Adapters)**:

```
          [ React Web / Mobile Client ]
                       │
                 (HTTP / REST)
                       ▼
       ┌───────────────────────────────┐
       │   Interfaces / HTTP Layer     │
       │   (Controllers, Validation)   │
       └───────────────┬───────────────┘
                       │
       ┌───────────────▼───────────────┐
       │      Application Layer        │
       │ (ProductService, EnquirySvc)  │
       └───────────────┬───────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
    [ IProductRepository ]   [ IEmailService ]   <── Domain Interfaces (Ports)
           ▲                       ▲
           │                       │
 ┌─────────┴─────────┐   ┌─────────┴─────────┐
 │ FakeStore / Mongo │   │ AWS SES / SMTP    │   <── Infrastructure Adapters
 └───────────────────┘   └───────────────────┘
```

1. **Pluggable Product Data Sources**:
   - The product catalogue is abstracted behind `IProductRepository`.
   - When the entrepreneur moves from Fake Store API to a proprietary database (PostgreSQL/MongoDB) or headless CMS (Shopify/Contentful), simply write `PostgresProductRepository implements IProductRepository`. Not a single line of business logic or frontend code needs to change.
2. **Pluggable Email & CRM Integration**:
   - The notification system is abstracted behind `IEmailService`.
   - Transitioning from in-memory testing to AWS SES, HubSpot, or SendGrid requires only implementing `AwsSesEmailService implements IEmailService`.
3. **Pluggable Enquiry Persistence**:
   - Enquiries are persisted via `IEnquiryRepository`. Replacing the memory store with Prisma/TypeORM or AWS DynamoDB is completely isolated to the infrastructure layer.
4. **Multi-Client Ready**:
   - The backend is a decoupled JSON REST API. A native iOS (Swift) or Android (Kotlin) app can consume the exact same endpoints without modification.
5. **AWS Cloud-Native Ready**:
   - Multi-stage Dockerfiles and AWS architecture blueprints (AWS App Runner / ECS Fargate + AWS SES + CloudFront) are included in `/aws`.

---

## 4. What You Would Do Next With Another Day

If given another 24 hours of development time, the following high-value enhancements would be implemented:

1. **Persistent Database & Migrations**:
   - Introduce PostgreSQL with **Prisma ORM** or **Drizzle**.
   - Create schema migrations for products, categories, enquiries, and enquiry notes.
2. **Customer Auto-Acknowledgement Email**:
   - Dispatch a branded confirmation email to the customer upon submission (`"We received your enquiry #ENQ-123. A sales specialist will contact you shortly"`).
3. **Internal Sales CRM / Admin Portal**:
   - Build a lightweight `/admin` dashboard where sales reps can view, filter, assign, and mark enquiry statuses (`New`, `Contacted`, `Quoted`, `Closed`).
4. **Faceted Filtering & Pagination**:
   - Add price range slider filters, rating threshold checkboxes, and cursor-based infinite scrolling.
5. **Automated E2E Testing Pipeline**:
   - Implement **Playwright** end-to-end tests covering search, category browsing, enquiry submission, and email reception in GitHub Actions CI.
