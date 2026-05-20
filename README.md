# ElyXen Dine 🍽️

> A luxury restaurant & cafe SaaS platform for online ordering, table reservations, and real-time delivery tracking.

![ElyXen Dine](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green) ![Vite](https://img.shields.io/badge/Vite-8-purple)

---

## ✨ Features

### Customer
- 🏠 Beautiful home page with featured restaurants & foods
- 🔍 Search & filter restaurants by cuisine, price, rating
- 🛒 Cart with real-time item management
- 💳 Multi-step checkout with coupon support
- 📦 Real-time delivery tracking
- 📅 Table reservation wizard (4-step flow)
- 👤 Customer dashboard — orders, reservations, notifications, settings
- ❤️ Favorites system

### Admin
- 🛡️ Role-based access — admin only panel
- 📊 Analytics dashboard with revenue & order charts
- 👥 User management — view all users, promote/demote roles
- 📋 Order management — confirm, deliver, cancel orders
- 📅 Reservation management — confirm or cancel bookings

### Auth
- 🔐 Email + password authentication (Supabase Auth)
- 🔑 Google OAuth support
- 🛡️ Protected routes with role-based access control
- 🔄 Persistent sessions

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 18 + Vite 8 + TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| Auth & DB | Supabase |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v7 |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Ashikur860/elyxen-dine.git
cd elyxen-dine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: https://supabase.com/dashboard → Your Project → Settings → API

### 4. Set up the database

Run the SQL schema in Supabase SQL Editor:

```
supabase/schema.sql
```

### 5. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 Default Admin Account

| Field | Value |
|---|---|
| Email | `admin@elyxendine.com` |
| Password | `ElyXen@Admin2026` |
| Panel URL | `/admin` |

> The admin account must be created via Supabase Auth Dashboard and role set to `admin` in both `public.users` table and `auth.users.raw_app_meta_data`.

---

## 📁 Project Structure

```
src/
├── app/          # App router & route config
├── components/   # UI components (button, card, badge...)
├── context/      # AuthContext (Supabase auth state)
├── integrations/ # Supabase client & types
├── layouts/      # Navbar, Footer, MainLayout, MobileNav
├── lib/          # Utility functions
├── pages/        # All pages (Home, Admin, Dashboard, Auth...)
├── services/     # Supabase data services
├── store/        # Zustand stores (auth, cart, UI)
├── styles/       # Global CSS
└── types/        # TypeScript interfaces
supabase/
└── schema.sql    # Full DB schema with RLS policies
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 📄 License

MIT © 2026 ElyXen Dine
