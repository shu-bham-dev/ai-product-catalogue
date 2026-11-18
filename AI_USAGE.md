# AI Usage Notes

This document provides a transparent, comprehensive account of how AI was utilized to design, build, test, and refine the **AI-Native Product Catalogue MVP**, in accordance with the evaluation criteria.

---

## 1. Tools and Models Used

- **Primary AI Assistant**: Antigravity AI Engine (Google DeepMind Advanced Agentic Coding environment).
- **Core Reasoning Models**:
  - `Gemini 3.8 Flash (Medium)` / `Gemini 3.8 Pro`: Used for iterative architecture design, requirement analysis, TypeScript clean architecture implementation, and unit test generation.
- **Developer Tools**:
  - Node.js 20 LTS, Vite, Vitest, React 18, Tailwind CSS, Docker, Git.

---

## 2. Committed Agent Instruction Files

- **`AGENTS.md`**: Committed to the repository root. It defines:
  - Strict hexagonal/clean architecture invariants (client isolation, domain independence, repository port abstractions).
  - Pluggable adapter guidelines for products and email notifications.
  - Reviewer zero-config constraints.
  - Command cheat sheet and code standards.

---

## 3. Plan & Specification

We executed a structured 4-phase plan:

1. **Phase 1: Architecture & Domain Boundary Design**
   - Read acceptance criteria and extract domain entities (`Product`, `Enquiry`).
   - Define interfaces (`IProductRepository`, `IEmailService`, `IEnquiryRepository`) to ensure the foundation can evolve without throwaway code.
2. **Phase 2: Backend & Infrastructure Implementation**
   - Implement `FakeStoreProductRepository` with caching and fallback.
   - Implement `LocalProductRepository` for hermetic offline execution.
   - Implement `MemoryEmailService` with a live reviewer inbox endpoint to fulfill the email acceptance criteria without paid accounts.
   - Implement Express routes, controllers, and dependency injection in `createApp()`.
3. **Phase 3: Frontend Client Implementation**
   - Build responsive React + TypeScript + Tailwind UI.
   - Implement Home page with Top 5 featured products.
   - Implement Category hub separating top-rated and additional products.
   - Implement text-matching search and product details.
   - Implement enquiry modal with validation and instant "Thank You" confirmation.
   - Implement interactive Reviewer Sales Mailbox viewer in the navbar.
4. **Phase 4: Dockerization, Testing & Documentation**
   - Multi-stage Dockerfiles and `docker-compose.yml`.
   - Comprehensive unit and integration test suites.
   - Complete `DECISIONS.md`, `README.md`, and `AI_USAGE.md`.

---

## 4. Key Prompts and Moments That Shaped the Solution

### Moment 1: Enforcing Strict Architectural Boundaries (Hexagonal Ports & Adapters)
- *Prompt / Directive*:
  > *"The client explicitly warned against throwaway prototypes. They anticipate changing the product source, the look and feel, and the email provider. Architect the backend with strict Ports and Adapters so that swapping Fake Store for PostgreSQL or swapping the email provider for AWS SES requires zero changes to the business logic or frontend."*
- *Impact*:
  Led to the separation of `backend/src/domain/interfaces/` from `infrastructure/`. The `ProductService` and `EnquiryService` depend purely on abstractions, making the system future-proof.

### Moment 2: Solving the Reviewer Email Dilemma Without Paid Accounts
- *Prompt / Directive*:
  > *"Acceptance criteria require that the sales inbox receives an email upon enquiry submission. However, Technical Constraint #6 forbids paid services or accounts the reviewer would need to create. How do we prove email delivery within 10 minutes?"*
- *Impact*:
  The AI conceived the **"Reviewer Sales Mailbox Simulator"**. The backend captures outbound email dispatches in memory, and the frontend navbar provides an interactive drawer to view incoming emails in real-time, complete with timestamps, headers, HTML styling, and raw text.

### Moment 3: Addressing External API Fragility with Resilient Fallback
- *Prompt / Directive*:
  > *"Fake Store API is a public demo server that can fail, experience latency spikes, or be blocked by strict firewalls/sandboxes. Ensure our backend is completely resilient to network instability."*
- *Impact*:
  We engineered `FakeStoreProductRepository` with a 4-second timeout, 5-minute memory cache, and an automatic fallback to bundled default products. If Fake Store API drops out, the app continues to operate without breaking.

---

## 5. Where the AI Got Something Wrong and How It Was Caught

### Issue 1: Direct Client-Side Fetching Habit
- **What happened**: Initially, standard AI boilerplate suggested calling `https://fakestoreapi.com/products` from the React frontend using a React hook.
- **How it was caught**: Technical Constraint #2 explicitly dictates: *"Do not call the Fake Store API directly from the client; all product data must go through your backend."*
- **Correction**: Immediately redirected the AI to implement an API proxy and service layer on the backend (`/api/products`), ensuring the client only talks to the internal backend.

### Issue 2: Category Breakdown Ratio Edge Cases
- **What happened**: When partitioning products into "top rated" versus "additional" for a category, an early AI implementation applied a static `>= 4.5` filter. For categories where all items scored below 4.5 or all items scored above 4.5, either the "top rated" or "additional" section remained completely empty, violating the acceptance criteria: *"THEN I see top rated products for that category AND I see additional products in that category"*.
- **How it was caught**: Reviewing the acceptance criteria and testing categories with narrow rating spreads.
- **Correction**: Updated `ProductService.getCategoryDetails()` with an adaptive algorithm: if no products meet 4.5, pick the top 50%; if all meet 4.5, reserve the upper half for top-rated and the rest for additional, guaranteeing both sections are populated.

### Issue 3: Docker Compose Healthcheck Ordering
- **What happened**: In the initial `docker-compose.yml`, the frontend container booted concurrently with the backend container, resulting in transient 502 Bad Gateway proxy errors on fast cold starts before the backend Node process had finished binding port 4000.
- **How it was caught**: Code review of Docker compose dependencies.
- **Correction**: Added a Docker healthcheck to the backend container (`http://localhost:4000/api/health`) and set `condition: service_healthy` on the frontend `depends_on` block.

---

## 6. Time Spent Breakdown

Total time spent: **~2.5 hours** (strictly within the recommended 2–3 hour time-box).

| Phase | Time Spent | Key Activities |
|---|---|---|
| **Planning & Architecture** | ~30 mins | Analyzing scenario constraints, defining Ports & Adapters, designing data models and API contracts. |
| **Backend & Resilience** | ~45 mins | Implementing domain layer, repositories, email adapters, controllers, Express server, and fallback logic. |
| **Frontend & UI / UX** | ~45 mins | Building React components, responsive layouts, enquiry form, and reviewer mailbox viewer. |
| **Testing & Dockerization**| ~20 mins | Writing unit and integration tests, Docker multi-stage builds, and docker-compose. |
| **Review & Documentation** | ~10 mins | Authoring `README.md`, `DECISIONS.md`, `AI_USAGE.md`, and verifying acceptance criteria. |
