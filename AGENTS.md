# AGENTS.md - Developer & Agent Instructions

This repository follows **Clean / Hexagonal Architecture (Ports and Adapters)**. All AI agents and human contributors must uphold the architectural invariants and coding conventions described below.

---

## 1. Architectural Invariants

1. **Client Isolation**: The client (React app) must **NEVER** call external third-party APIs (such as Fake Store API) directly. All requests must route through our backend API at `/api/*`.
2. **Ports & Adapters (Hexagonal)**:
   - **Domain Layer (`backend/src/domain`)**: Contains pure TypeScript interfaces (`IProductRepository`, `IEmailService`, `IEnquiryRepository`) and entities (`Product`, `Enquiry`). Zero external framework dependencies.
   - **Application Layer (`backend/src/application`)**: Use cases and orchestration services (`ProductService`, `EnquiryService`). Depends only on domain interfaces.
   - **Infrastructure Layer (`backend/src/infrastructure`)**: Concrete adapters (`FakeStoreProductRepository`, `LocalProductRepository`, `MemoryEmailService`, `ConsoleEmailService`, `SmtpEmailService`).
   - **Interfaces / HTTP Layer (`backend/src/interfaces/http`)**: Express controllers, routers, and request validation.
3. **Resilience & Fallbacks**: Any external service dependency (e.g., Fake Store API, external SMTP) must provide graceful fallback or timeout handling to prevent downtime.
4. **Zero-Configuration Reviewer Experience**: Default settings must run hermetically out of the box without requiring external credentials, paid accounts, or network access (`EMAIL_PROVIDER=memory`, `PRODUCT_DATA_SOURCE=fakestore` with local fallback).

---

## 2. Directory Structure

```
ai-product-catalogue/
├── backend/
│   ├── src/
│   │   ├── domain/              # Core entities & repository/service interfaces
│   │   ├── application/         # Business logic and use case services
│   │   ├── infrastructure/      # Concrete repository and email adapters
│   │   ├── interfaces/http/     # Express controllers and route handlers
│   │   ├── config/              # App environment config
│   │   ├── app.ts               # App factory with dependency injection
│   │   └── server.ts            # Entrypoint
│   └── tests/                   # Unit & integration test suites
├── frontend/
│   ├── src/
│   │   ├── api/                 # Typed API client calling our backend
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Top-level route views
│   │   ├── types/               # TypeScript domain models
│   │   ├── App.tsx              # Application layout & state
│   │   └── main.tsx             # React entrypoint
│   └── tests/
├── aws/                         # AWS ECS / App Runner deployment specifications
├── docker-compose.yml           # Unified multi-container orchestration
├── DECISIONS.md                 # Assumptions and architectural rationales
├── AI_USAGE.md                  # AI collaboration disclosure & prompts
└── README.md                    # Primary onboarding guide
```

---

## 3. Essential Commands

| Action | Command |
|---|---|
| **Run Everything (Docker)** | `docker compose up --build` |
| **Run Everything (Local)** | `npm run setup && npm run dev` |
| **Backend Dev** | `npm --prefix backend run dev` |
| **Frontend Dev** | `npm --prefix frontend run dev` |
| **Run All Tests** | `npm test` |
| **Build for Production** | `npm run build` |

---

## 4. Code Standards

- **TypeScript**: Strict mode enabled across frontend and backend. Avoid `any` where possible.
- **Error Handling**: Use standard HTTP status codes (200, 201, 400, 404, 500) and consistent `{ error: string }` error envelopes.
- **Styling**: Tailwind CSS with semantic classes. Maintain accessibility and responsive layouts.
- **Enquiry Flow**: Form submissions must validate name, email, and message on client and backend.
