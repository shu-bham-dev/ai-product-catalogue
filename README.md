# AuraStore - AI-Native Product Catalogue MVP

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-cyan.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Compatible-orange.svg)](https://aws.amazon.com/)

A production-grade, AI-native product catalogue built with **Clean Architecture (Hexagonal / Ports & Adapters)**. Designed for an entrepreneur who wants a solid, modular foundation that can scale and evolve beyond the initial Proof of Concept (PoC).

---

## 📑 Table of Contents

- [Technology Choices & Rationale](#-technology-choices--rationale)
- [Quick Start (< 2 Minutes)](#-quick-start--2-minutes)
- [Acceptance Criteria Verification](#-acceptance-criteria-verification)
- [Hexagonal Architecture & Future-Proofing](#-hexagonal-architecture--future-proofing)
- [Sales Inbox Simulator (Zero-Config Testing)](#-sales-inbox-simulator-zero-config-testing)
- [API Reference](#-api-reference)
- [Running Tests](#-running-tests)
- [AWS Deployment Readiness](#-aws-deployment-readiness)
- [Accompanying Documentation](#-accompanying-documentation)

---

## 🛠 Technology Choices & Rationale

| Layer | Selection | Rationale |
|---|---|---|
| **Client** | **React (TypeScript) + Vite + Tailwind CSS** | **Strict End-to-End Type Safety**: Shared domain interfaces ensure contract consistency between backend and UI.<br>**Superior Developer Velocity**: Instant HMR via Vite ensures rapid feature turnaround.<br>**Responsive & Accessible**: Tailwind CSS provides clean, responsive styling ready for aesthetic customization without rewriting components. |
| **Backend** | **Node.js (TypeScript) + Express** | **Hexagonal Modularity**: Express provides a lightweight HTTP foundation without framework bloat, making it straightforward to implement pure Domain Interfaces (Ports) and Infrastructure Adapters.<br>**Seamless JSON Processing**: High throughput for proxying, transforming, and caching external product feeds.<br>**AWS Cloud Native**: Seamless packaging into lightweight Alpine Docker containers compatible with AWS App Runner, ECS Fargate, and Lambda. |

---

## 🚀 Quick Start (< 2 Minutes)

Reviewers can spin up the complete application using **either Docker Compose** (recommended) or **Standard npm**.

### Option A: Run via Docker Compose (Single Command)

Requires Docker Desktop or Docker Engine:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173) (also available at [http://localhost:3000](http://localhost:3000))
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Healthcheck**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

### Option B: Run Locally with Node.js (No Docker required)

Requires **Node.js 20+** and **npm**:

```bash
# 1. Install dependencies across backend & frontend
npm run setup

# 2. Start backend and frontend concurrently
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)

---

## ✅ Acceptance Criteria Verification

Every acceptance criteria specified in the challenge has been implemented and tested:

### 1. Home Page — Top Rated Featured Products
- **Criteria**:
  > *GIVEN I have chosen 5 products to be "top rated"*
  > *WHEN I am viewing the home page*
  > *THEN I see those 5 featured products*
- **Implementation**: The backend algorithm (`GET /api/products/featured?limit=5`) extracts the top 5 highest customer-rated items across the catalogue. The frontend Home Page showcases these top 5 products in a dedicated "Top Rated Products (Featured 5)" section with rating badges and review statistics.

### 2. Category Page — Top Rated & Additional Partitioning
- **Criteria**:
  > *GIVEN my products are organised into categories*
  > *WHEN I click on a category link*
  > *THEN I see top rated products for that category*
  > *AND I see additional products in that category*
- **Implementation**: Clicking any category pill or navigation hub opens the dedicated Category Page (`/category/:name`). The page explicitly partitions products into:
  1. **Top Rated in {Category}** (highlighted cards scoring &ge; 4.5 stars)
  2. **Additional Products in {Category}** (all remaining products in that department).

### 3. Search — Text Matching Filter
- **Criteria**:
  > *GIVEN I am looking for a specific product*
  > *AND I have entered a search term in the search bar*
  > *WHEN I click the search button*
  > *THEN I only see products that have text matching that search term*
- **Implementation**: Entering a search term (e.g. "backpack", "jacket", "SSD", or "gold") and pressing Search queries `GET /api/products?search=<term>`. The backend performs case-insensitive text matching across title, description, and category. Only matching products are returned.

### 4. Product Page — Detailed View
- **Criteria**:
  > *GIVEN I am browsing the products*
  > *AND I want to see more details about a specific product*
  > *WHEN I click on a product tile*
  > *THEN I see the product details page*
  > *AND I click on the Enquire button*
- **Implementation**: Clicking any product tile navigates to `/product/:id`, displaying full image previews, price, star ratings breakdown, SKU, verified badges, detailed descriptions, and an "Enquire About This Product" button.

### 5. Enquiry Submission — Sales Inbox Dispatch & Thank You Confirmation
- **Criteria**:
  > *GIVEN I am viewing a product*
  > *AND I am interested in a product*
  > *AND I click on the Enquire button*
  > *AND I complete the subsequent form with my contact details*
  > *WHEN I submit the form*
  > *THEN the sales inbox will receive an email*
  > *AND the customer will see a "Thank you" message*
- **Implementation**:
  - The modal collects customer Name, Email, Phone, and Message with full client & server validation.
  - Submitting sends `POST /api/enquiries`.
  - The backend dispatches an email to `sales@catalogue.example.com` via `IEmailService`.
  - The customer is presented with an immediate **"Thank You for Your Enquiry!"** confirmation containing an enquiry reference ID.

---

## 📬 Sales Inbox Simulator (Zero-Config Testing)

To satisfy **Constraint #6** (*"Your solution must not depend on paid services or accounts the reviewer would need to create"*), the system includes a built-in **Reviewer Sales Mailbox Simulator**:

1. Click the **"Sales Mailbox"** button located in the top-right corner of the navigation bar.
2. An interactive drawer opens displaying all emails delivered to the sales team in real-time.
3. Reviewers can inspect the exact **To / From headers**, **timestamp**, **enquiry ID**, **rendered HTML email template**, and **raw plain-text body**.
4. Dispatched emails are also logged directly to the backend stdout console.

---

## 🏛 Hexagonal Architecture & Future-Proofing

The entrepreneur specifically requested a foundation that does not get thrown away when requirements evolve:

```
                  ┌──────────────────────────────────────────────┐
                  │                 Domain Layer                 │
                  │  Entities: Product, Enquiry                  │
                  │  Interfaces: IProductRepository,             │
                  │              IEmailService,                  │
                  │              IEnquiryRepository              │
                  └───────────────────────┬──────────────────────┘
                                          │
                  ┌───────────────────────▼──────────────────────┐
                  │              Application Layer               │
                  │  ProductService, EnquiryService              │
                  └───────────────────────┬──────────────────────┘
                                          │
         ┌────────────────────────────────┴────────────────────────────────┐
         │                                                                 │
┌────────▼─────────────────────────────────┐   ┌───────────────────────────▼─────────────────────┐
│       Infrastructure Layer (Adapters)    │   │           Interfaces / HTTP Layer               │
│ • FakeStoreProductRepository (w/ Cache)  │   │ • ProductController, EnquiryController          │
│ • LocalProductRepository (Offline Mock)  │   │ • Express REST Routes (/api/*)                  │
│ • MemoryEmailService (Mailbox Viewer)    │   │ • Input Validation Middlewares                  │
│ • ConsoleEmailService & SmtpEmailService │   └─────────────────────────────────────────────────┘
└──────────────────────────────────────────┘
```

- **Pluggable Product Source**: Switching from Fake Store API to a PostgreSQL database, Shopify, or Contentful simply requires implementing `IProductRepository`. The UI and business services remain untouched.
- **Resilient Fallback**: If Fake Store API is blocked or offline, `FakeStoreProductRepository` automatically falls back to the bundled offline product catalogue.
- **Pluggable Email Notifications**: Seamlessly toggle between `memory`, `console`, and `smtp` via the `EMAIL_PROVIDER` environment variable.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and service uptime |
| `GET` | `/api/products` | Retrieve all products (supports `?search=` and `?category=`) |
| `GET` | `/api/products/featured` | Retrieve top 5 rated products |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `GET` | `/api/categories` | Retrieve list of all category names |
| `GET` | `/api/categories/:name` | Retrieve category breakdown (`topRated` + `additional`) |
| `POST` | `/api/enquiries` | Submit customer enquiry and dispatch sales email |
| `GET` | `/api/enquiries/mailbox` | Retrieve sent emails for reviewer verification |

---

## 🧪 Running Tests

The test suite covers unit and integration testing across domain services, repository fallback logic, validation rules, and REST API endpoints:

```bash
# Run all backend unit & integration tests
npm test
```

---

## ☁️ AWS Deployment Readiness

The project is structured for effortless deployment on AWS:
- **AWS App Runner**: Blueprint provided in [`aws/apprunner.yaml`](./aws/apprunner.yaml).
- **Amazon S3 + CloudFront**: Static React frontend bundle.
- **Amazon SES**: Drop-in adapter implementation detailed in [`aws/README.md`](./aws/README.md).

---

## 📖 Accompanying Documentation

- **[`DECISIONS.md`](./DECISIONS.md)**: Architectural assumptions, trade-offs, simplified requirements, and next-day roadmap.
- **[`AI_USAGE.md`](./AI_USAGE.md)**: Tools and models used, prompt history, failure corrections, and time tracking.
- **[`AGENTS.md`](./AGENTS.md)**: Guidelines, patterns, and instructions for future AI assistants working in this codebase.
- **[`.env.example`](./.env.example)**: Reference environment variables.
