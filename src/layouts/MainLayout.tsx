import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from '@/components/shared/CartDrawer'
import { MobileNav } from './MobileNav'
import { Toaster } from 'sonner'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartDrawer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
        richColors
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 pt-16 md:pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileNav />
    </div>
  )
}
