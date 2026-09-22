# Kalulu Vision — Technology Training Enrollment Platform

> **Innovate. Empower. Transform.**

A modern, mobile-first single-page enrollment and subscription website for Kalulu Vision Tech Lessons, built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## Features

- Hero section with branding and CTAs
- 7 course cards (Programming, Web Dev, AI/ML, Data Analytics, Automation, IoT, Custom)
- Subscription pricing plans (Weekly, Monthly, 1-on-1)
- Enrollment form with validation and auto-generated Enrollment ID (e.g. `KV-2026-00125`)
- Payment section with MoMo / Airtel Money / Bank details
- WhatsApp integration — pre-filled payment proof message
- **Payment pending verification** workflow (never auto-activates)
- Admin dashboard at `/admin` — verify/reject payments, enable/disable subscriptions
- Contact section
- Responsive, mobile-first design

---

## Quick Start

### 1. Clone / open the project

```bash
cd "your-project-directory"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
ADMIN_PASSWORD=your-strong-password
SESSION_SECRET=your-random-secret-string
```

### 4. Update configuration

Edit **`lib/config.ts`** to set your real details:

```ts
export const SITE_CONFIG = {
  whatsappNumber: "260XXXXXXXXX",   // ← your WhatsApp number (no + or spaces)
  email: "bernardlusale20@gmail.com",
  // ...
};

export const PAYMENT_DETAILS = {
  momo:  { number: "0XX XXX XXXX", name: "Kalulu Vision" },
  airtel: { number: "0XX XXX XXXX", name: "Kalulu Vision" },
  bank: {
    bankName: "Your Bank",
    accountName: "Your Account Name",
    accountNumber: "XXXXXXXXXXXX",
    branch: "Your Branch",
  },
};

// Update prices here:
export const PLANS: Plan[] = [
  { id: "weekly",    price: 150, ... },
  { id: "monthly",   price: 450, ... },
  { id: "one-on-one", price: 800, ... },
];
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)  
Default password: `admin123` (change in `.env.local`!)

---

## Project Structure

```
kaluluvision/
├── app/
│   ├── api/
│   │   ├── enrollments/route.ts     # POST: create enrollment
│   │   ├── payments/route.ts        # POST: submit payment proof
│   │   └── admin/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       ├── enrollments/route.ts
│   │       ├── payments/[action]/route.ts   # verify | reject
│   │       └── subscriptions/[action]/route.ts # enable | disable
│   ├── admin/
│   │   ├── page.tsx                 # Dashboard (protected)
│   │   └── login/page.tsx
│   ├── layout.tsx
│   ├── page.tsx                     # Main landing page
│   └── globals.css
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLoginForm.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── CoursesSection.tsx
│   │   ├── PlansSection.tsx
│   │   ├── EnrollmentSection.tsx    # Form + Payment + Submitted stages
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   └── Button.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── MainContent.tsx
├── lib/
│   ├── auth.ts                      # Cookie-based admin session
│   ├── config.ts                    # ← ALL configurable values here
│   ├── db.ts                        # File-based persistence (swap for DB later)
│   ├── types.ts                     # TypeScript interfaces
│   └── utils.ts                     # Helpers, WhatsApp URL builder, etc.
├── data/                            # Auto-created — JSON data files
│   ├── enrollments.json
│   ├── payments.json
│   └── subscriptions.json
├── .env.example
└── README.md
```

---

## User Journey

```
Landing Page
  ↓ Click "Enroll Now" or a course card
Choose Course & Plan
  ↓ Fill enrollment form
Receive Enrollment ID  (e.g. KV-2026-00125)
  ↓
View MoMo / Bank payment details
  ↓ Make payment manually
Click "I've Made Payment"
  ↓
⏳ Payment Submitted — Awaiting Verification
  ↓ Send screenshot on WhatsApp
Admin reviews payment in /admin dashboard
  ↓ Admin clicks "Verify Payment"
✓ Subscription Enabled  (ACTIVE)
```

---

## Admin Dashboard

URL: `/admin`  
Default password: set in `ADMIN_PASSWORD` env var (default: `admin123`)

**Actions available:**
- Verify Payment → activates subscription with correct expiry
- Reject Payment → marks payment as rejected
- Enable Subscription → manually activate
- Disable Subscription → manually deactivate

---

## Data Persistence

Currently uses JSON files in `/data/`. This is suitable for low-volume use.

**To switch to PostgreSQL + Prisma:**

1. `npm install prisma @prisma/client`
2. `npx prisma init`
3. Define models in `prisma/schema.prisma` (see schema below)
4. Replace functions in `lib/db.ts` with Prisma calls

### Prisma Schema

```prisma
model Enrollment {
  id           String   @id @default(cuid())
  enrollmentId String   @unique
  fullName     String
  whatsapp     String
  email        String
  course       String
  plan         String
  learningMode String
  createdAt    DateTime @default(now())
}

model Payment {
  id           String    @id @default(cuid())
  enrollmentId String    @unique
  amount       Float
  paymentMethod String
  status       String    @default("PENDING_VERIFICATION")
  submittedAt  DateTime  @default(now())
  verifiedAt   DateTime?
}

model Subscription {
  id           String    @id @default(cuid())
  enrollmentId String    @unique
  plan         String
  status       String    @default("PENDING")
  startDate    DateTime?
  expiryDate   DateTime?
}
```

---

## Future Payment Integration

The architecture supports dropping in a real payment provider:

```
Payment Provider → Webhook → /api/webhooks/payment → Verify → Activate Subscription
```

Create `app/api/webhooks/payment/route.ts` and call `savePayment()` + `saveSubscription()` from `lib/db.ts`.

---

## Deployment on Vercel

1. Push your project to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Set environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
4. Click **Deploy**.

> **Important**: The file-based `/data` folder does **not** persist between Vercel deployments (serverless functions are stateless). For production, switch to a database (Vercel Postgres, PlanetScale, Neon, Supabase, etc.).

### Persistent storage options for Vercel:
- **Vercel Postgres** (easiest — built-in)
- **Neon** (free PostgreSQL tier)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL + extras)

---

## Security Notes

- Admin password is stored in environment variables — never committed to code.
- Session cookie is `httpOnly`, `secure` (in production), `sameSite: strict`.
- All inputs are sanitized server-side before storage.
- Admin routes are protected — unauthenticated requests redirect to `/admin/login`.
- Payment status is **never** automatically set to VERIFIED by the frontend.

---

© 2026 Kalulu Vision. All rights reserved.
