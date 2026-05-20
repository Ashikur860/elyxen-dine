# ElyXen Dine — Supabase Setup Guide

## 1. Create Project
Go to https://supabase.com → New Project → note your URL and anon key.

## 2. Environment Variables
Edit `.env.local` in the project root:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

## 3. Run the Schema
Supabase Dashboard → SQL Editor → paste contents of `schema.sql` → Run.

## 4. Enable Authentication Providers

### Email/Password (already on by default)
Dashboard → Authentication → Providers → Email → Enable

### Google OAuth
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Authorized redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
4. Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret

## 5. Configure Auth Redirect URLs
Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: add `http://localhost:3000/**`

## 6. Enable Realtime
Dashboard → Database → Replication → enable for:
- `orders`
- `delivery_tracking`
- `notifications`

(Already included in schema.sql via `ALTER PUBLICATION`)

## 7. Storage (optional — for food/restaurant images)
Dashboard → Storage → New Bucket:
- Name: `restaurant-images`  Public: ✓
- Name: `food-images`        Public: ✓
- Name: `user-avatars`       Public: ✓

## Verification
After setup, restart the dev server:
```
npm run dev
```
Try signing up at http://localhost:3000/auth/signup — the user should appear in
Supabase Dashboard → Authentication → Users.
