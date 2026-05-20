import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { useUIStore } from '@/store/uiStore'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const RestaurantsPage = lazy(() => import('@/pages/RestaurantsPage').then((m) => ({ default: m.RestaurantsPage })))
const RestaurantDetailPage = lazy(() => import('@/pages/RestaurantDetailPage').then((m) => ({ default: m.RestaurantDetailPage })))
const ReservationPage = lazy(() => import('@/pages/ReservationPage').then((m) => ({ default: m.ReservationPage })))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const CustomerDashboard = lazy(() => import('@/pages/CustomerDashboard').then((m) => ({ default: m.CustomerDashboard })))
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const FAQPage = lazy(() => import('@/pages/FAQPage').then((m) => ({ default: m.FAQPage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage').then((m) => ({ default: m.SignupPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))
const DeliveryTrackingPage = lazy(() => import('@/pages/DeliveryTrackingPage').then((m) => ({ default: m.DeliveryTrackingPage })))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
          <span className="text-black font-bold text-sm">E</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}

function DashboardRedirect() {
  const { user, isLoading } = useAuth()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    import('@/integrations/supabase/client').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        const role = data?.session?.user?.app_metadata?.role
        setIsAdmin(role === 'admin')
        setChecking(false)
      })
    })
  }, [])

  if (isLoading || checking) return <PageLoader />
  if (isAdmin) return <Navigate to="/admin" replace />
  return <CustomerDashboard />
}

function ThemeInitializer() {
  const theme = useUIStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return null
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="reservation" element={<ReservationPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/orders"
            element={
              <ProtectedRoute>
                <CustomerDashboard defaultTab="orders" />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/favorites"
            element={
              <ProtectedRoute>
                <CustomerDashboard defaultTab="favorites" />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/settings"
            element={
              <ProtectedRoute>
                <CustomerDashboard defaultTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/reservations"
            element={
              <ProtectedRoute>
                <CustomerDashboard defaultTab="reservations" />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/signup" element={<SignupPage />} />
          <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="orders/:orderId/track"
            element={
              <ProtectedRoute>
                <DeliveryTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🍽️</div>
      <h1 className="font-display text-4xl font-bold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">This page doesn't exist or has been moved. Let's get you back to something delicious.</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeInitializer />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
