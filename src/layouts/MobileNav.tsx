import { NavLink } from 'react-router-dom'
import { Home, UtensilsCrossed, CalendarDays, LayoutDashboard, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/restaurants', icon: UtensilsCrossed, label: 'Explore' },
  { href: '/reservation', icon: CalendarDays, label: 'Reserve' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Account' },
]

export function MobileNav() {
  const totalItems = useCartStore((s) => s.getTotalItems())
  const { toggleCart } = useUIStore()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 pb-safe"
    >
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                isActive ? 'text-amber-500' : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center transition-all', isActive && 'bg-amber-500/10')}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Cart */}
        <button
          onClick={toggleCart}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-muted-foreground relative"
        >
          <div className="h-8 w-8 rounded-xl flex items-center justify-center relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>
    </motion.nav>
  )
}
