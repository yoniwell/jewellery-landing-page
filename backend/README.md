# Abel Gemstone - Backend API Service

Production-ready REST API backend for Abel Gemstone built with **Node.js**, **Express.js**, **PostgreSQL**, and **TypeScript**.

---

## 💎 Features

* **PostgreSQL Database**: Relational schema for luxury gemstones, buyer inquiries, categories, media gallery, dealer accounts, and audit activity logs.
* **JWT & Passcode Authentication**: Secure authentication with `bcryptjs` password hashing and JWT Bearer token generation.
* **Wholesale Inquiries System**: Public portal endpoint with validation, storage, and dealer inquiry workflow management.
* **Full CRUD Gemstone Inventory**: Live filtering by category, status (`AVAILABLE`, `RESERVED`, `SOLD`, `COMING SOON`), rough vs faceted, and automatic activity logging.
* **Dynamic Category Management**: Owner-controlled categories with real-time stone count aggregation.
* **Luxury Gallery**: Media repository for gemstones, field mining footage, and lapidary photography.
* **Analytics & Valuation**: Executive dashboard metrics calculating live inventory counts, portfolio USD valuation, and category distribution.
* **CORS & Proxy Ready**: Configured for local development (`http://localhost:3000` / `http://localhost:5173`) and production hosting.

---

## 📂 Project Structure

```
backend/
├── package.json              # Backend dependencies and run scripts
├── tsconfig.json             # TypeScript compiler configuration
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── src/
│   ├── config/
│   │   ├── env.ts            # Typed environment variables
│   │   └── db.ts             # PostgreSQL connection pool (pg.Pool)
│   ├── db/
│   │   ├── schema.sql        # Database DDL schema (tables & indexes)
│   │   ├── init.ts           # Schema migration / table creation runner
│   │   └── seed.ts           # Authentic African gemstone seeder
│   ├── types/
│   │   └── index.ts          # TypeScript domain interfaces
│   ├── utils/
│   │   └── helpers.ts        # Database row mappers (snake_case -> camelCase) & logger
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication middleware
│   │   └── errorHandler.ts   # Centralized error handler
│   ├── controllers/
│   │   ├── authController.ts     # Login, me, password change
│   │   ├── gemstoneController.ts # Gemstones CRUD, filtering, reset
│   │   ├── inquiryController.ts  # Buyer inquiries management
│   │   ├── categoryController.ts # Categories with aggregated stone counts
│   │   ├── galleryController.ts  # Gallery media management
│   │   └── statsController.ts    # Dashboard metrics & analytics
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── gemstoneRoutes.ts
│   │   ├── inquiryRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── galleryRoutes.ts
│   │   ├── statsRoutes.ts
│   │   └── index.ts          # Aggregated /api router
│   ├── app.ts                # Express app factory (CORS, parsers, routes)
│   └── server.ts             # Server entry point with DB health check
```

---

## 🛠️ Getting Started

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v24)
* **PostgreSQL** v14+ (running locally on port `5432` or via remote connection)

### 2. Environment Configuration
Ensure `.env` exists in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/abel_gemstone
JWT_SECRET=abel_gemstone_luxury_secure_jwt_secret_key_2026!
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

### 3. Initialize & Seed Database
Run the schema setup and inventory seeder:

```bash
# Initialize tables and seed 15 authentic gemstone specimens
npm run db:seed
```

### 4. Start Server

```bash
# Development mode with hot-reloading
npm run dev

# Or start directly
npm start
```

The server binds to `http://localhost:5000`.

---

## 📡 API Reference

### Health
* `GET /api/health` - Check backend service and PostgreSQL connection status.

### Authentication
* `POST /api/auth/login` - Authenticate dealer (`email`, `password`). Returns JWT token.
* `GET /api/auth/me` - Verify active session (`Authorization: Bearer <token>`).
* `POST /api/auth/change-password` - Update security passcode (Authorized).

**Default Admin Credentials:**
* **Email**: `admin@abelgemstone.com`
* **Password**: `AbelGemstone2026!`

### Gemstone Inventory
* `GET /api/gemstones` - List all gemstones (Query filters: `?category=paraiba&status=AVAILABLE&isRough=false`).
* `GET /api/gemstones/:id` - Get details of a single gemstone.
* `POST /api/gemstones` - Add new specimen (Authorized).
* `PUT /api/gemstones/:id` - Update specimen details (Authorized).
* `DELETE /api/gemstones/:id` - Delete specimen (Authorized).
* `DELETE /api/gemstones` - Clear all specimens (Authorized).
* `POST /api/gemstones/reset-real-data` - Restore authentic African gemstone seed catalog (Authorized).

### Buyer Inquiries
* `POST /api/inquiries` - Submit inquiry from public inquiry modal or contact desk.
* `GET /api/inquiries` - Retrieve buyer inquiries (Authorized).
* `PUT /api/inquiries/:id` - Update inquiry status (Authorized).
* `DELETE /api/inquiries/:id` - Delete inquiry (Authorized).

### Categories
* `GET /api/categories` - List categories with dynamic gemstone count.
* `POST /api/categories` - Create new gemstone category (Authorized).
* `DELETE /api/categories/:id` - Delete category (Authorized).

### Gallery Media
* `GET /api/gallery` - List luxury gallery items.
* `POST /api/gallery` - Add gallery photo or video (Authorized).
* `PUT /api/gallery/:id` - Update gallery item (Authorized).
* `DELETE /api/gallery/:id` - Delete gallery item (Authorized).

### Analytics & Dashboard Stats
* `GET /api/stats` - Retrieve executive metrics (Total stones, total valuation USD, status counts, category breakdown, recent activity logs) (Authorized).
