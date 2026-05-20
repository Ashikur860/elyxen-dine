-- ============================================================
-- ElyXen Dine - Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'restaurant_manager');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'cooking', 'picked_up', 'on_the_way', 'delivered', 'cancelled');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE delivery_status AS ENUM ('preparing', 'cooking', 'picked_up', 'on_the_way', 'delivered');

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  avatar_url  TEXT,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RESTAURANTS ─────────────────────────────────────────────
CREATE TABLE public.restaurants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  cuisine_type    TEXT NOT NULL,
  rating          NUMERIC(3,2) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  price_range     TEXT DEFAULT '$$',
  image_url       TEXT,
  cover_url       TEXT,
  address         TEXT,
  city            TEXT,
  phone           TEXT,
  email           TEXT,
  is_open         BOOLEAN DEFAULT TRUE,
  delivery_time   TEXT DEFAULT '30-45 min',
  delivery_fee    NUMERIC(10,2) DEFAULT 2.99,
  minimum_order   NUMERIC(10,2) DEFAULT 15,
  is_featured     BOOLEAN DEFAULT FALSE,
  tags            TEXT[],
  owner_id        UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CATEGORIES ──────────────────────────────────────────────
CREATE TABLE public.categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  icon          TEXT,
  description   TEXT,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  sort_order    INTEGER DEFAULT 0
);

-- ─── FOODS ───────────────────────────────────────────────────
CREATE TABLE public.foods (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id     UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id       UUID REFERENCES public.categories(id),
  name              TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL,
  image_url         TEXT,
  is_available      BOOLEAN DEFAULT TRUE,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_vegetarian     BOOLEAN DEFAULT FALSE,
  is_spicy          BOOLEAN DEFAULT FALSE,
  rating            NUMERIC(3,2) DEFAULT 0,
  review_count      INTEGER DEFAULT 0,
  preparation_time  INTEGER DEFAULT 15,
  calories          INTEGER,
  tags              TEXT[],
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ──────────────────────────────────────────────────
CREATE TABLE public.orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.users(id),
  restaurant_id       UUID NOT NULL REFERENCES public.restaurants(id),
  status              order_status NOT NULL DEFAULT 'pending',
  total_amount        NUMERIC(10,2) NOT NULL,
  delivery_fee        NUMERIC(10,2) DEFAULT 0,
  discount_amount     NUMERIC(10,2) DEFAULT 0,
  delivery_address    JSONB,
  payment_method      TEXT DEFAULT 'card',
  payment_status      TEXT DEFAULT 'pending',
  notes               TEXT,
  estimated_delivery  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────
CREATE TABLE public.order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_id               UUID NOT NULL REFERENCES public.foods(id),
  quantity              INTEGER NOT NULL DEFAULT 1,
  unit_price            NUMERIC(10,2) NOT NULL,
  total_price           NUMERIC(10,2) NOT NULL,
  special_instructions  TEXT
);

-- ─── RESERVATIONS ────────────────────────────────────────────
CREATE TABLE public.reservations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id),
  restaurant_id     UUID NOT NULL REFERENCES public.restaurants(id),
  date              DATE NOT NULL,
  time              TEXT NOT NULL,
  guest_count       INTEGER NOT NULL DEFAULT 2,
  status            reservation_status NOT NULL DEFAULT 'pending',
  special_requests  TEXT,
  confirmation_code TEXT UNIQUE DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 7)),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE public.reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id),
  restaurant_id UUID REFERENCES public.restaurants(id),
  food_id       UUID REFERENCES public.foods(id),
  order_id      UUID REFERENCES public.orders(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DELIVERY TRACKING ───────────────────────────────────────
CREATE TABLE public.delivery_tracking (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status     delivery_status NOT NULL,
  notes      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'info',
  is_read    BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COUPONS ─────────────────────────────────────────────────
CREATE TABLE public.coupons (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           TEXT NOT NULL UNIQUE,
  description    TEXT,
  discount_type  TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL,
  minimum_order  NUMERIC(10,2) DEFAULT 0,
  max_uses       INTEGER,
  used_count     INTEGER DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAVORITES ───────────────────────────────────────────────
CREATE TABLE public.favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id       UUID REFERENCES public.foods(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, food_id),
  UNIQUE(user_id, restaurant_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users: read own profile, update own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Restaurants: everyone can read, only owner/admin can write
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
  FOR SELECT USING (TRUE);

CREATE POLICY "Owners can manage own restaurant" ON public.restaurants
  FOR ALL USING (auth.uid() = owner_id);

-- Foods: everyone can read
CREATE POLICY "Anyone can view foods" ON public.foods
  FOR SELECT USING (TRUE);

CREATE POLICY "Restaurant owners can manage foods" ON public.foods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id AND r.owner_id = auth.uid()
    )
  );

-- Orders: users can see own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: follow order policy
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- Reservations: own only
CREATE POLICY "Users can view own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reservations" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: public read, own write
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delivery tracking: own orders only
CREATE POLICY "Users can view own delivery tracking" ON public.delivery_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- Notifications: own only
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Favorites: own only
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- REALTIME (enable for live order tracking)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- SAMPLE COUPONS
-- ============================================================

INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_order, is_active)
VALUES
  ('ELYXEN20', '20% off your order', 'percentage', 20, 25, TRUE),
  ('WELCOME10', '10% welcome discount', 'percentage', 10, 0, TRUE),
  ('FREESHIP', 'Free delivery', 'fixed', 2.99, 20, TRUE);
