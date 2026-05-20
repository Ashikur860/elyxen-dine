import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Menu, X, Sun, Moon, User, ChevronDown,
  LogOut, LayoutDashboard, Heart, ClipboardList, Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useAuth } from '@/context/AuthContext'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/restaurants', label: 'Restaurants' },
  { href: '/reservation', label: 'Reserve' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { theme, toggleTheme, toggleCart, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore()
  const totalItems = useCartStore((s) => s.getTotalItems())
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      {/* Backdrop — closes dropdown when clicking outside */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-[45]" onClick={() => setUserMenuOpen(false)} />
      )}

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg'
            : 'bg-background/80 backdrop-blur-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
                <span className="text-black font-bold text-sm">E</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg leading-none block">ElyXen</span>
                <span className="text-amber-500 text-xs font-medium leading-none">Dine</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <NavLink
                  key={href}
                  to={href}
                  end={href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="h-9 w-9 rounded-xl border border-border bg-background flex items-center justify-center hover:border-amber-500/50 hover:text-amber-500 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative h-9 w-9 rounded-xl border border-border bg-background flex items-center justify-center hover:border-amber-500/50 hover:text-amber-500 transition-all"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 h-4.5 min-w-[18px] px-1 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {isAuthenticated && user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-background hover:border-amber-500/50 transition-all"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback className="text-xs">{getInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden z-[50]"
                      >
                        <div className="p-3 border-b border-border">
                          <p className="font-semibold text-sm">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                          {[
                            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { href: '/dashboard/orders', icon: ClipboardList, label: 'My Orders' },
                            { href: '/dashboard/favorites', icon: Heart, label: 'Favorites' },
                            { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
                            ...(user.role === 'admin' ? [{ href: '/admin', icon: LayoutDashboard, label: 'Admin Panel' }] : []),
                          ].map(({ href, icon: Icon, label }) => (
                            <button
                              key={href}
                              onClick={() => { setUserMenuOpen(false); navigate(href) }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors"
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {label}
                            </button>
                          ))}
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors mt-1 border-t border-border pt-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
                className="md:hidden h-9 w-9 rounded-xl border border-border bg-background flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-background/98 backdrop-blur-xl pt-20 px-4 md:hidden"
          >
            <nav className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <NavLink
                  key={href}
                  to={href}
                  end={href === '/'}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3.5 rounded-xl text-base font-medium transition-colors',
                      isActive ? 'text-amber-500 bg-amber-500/10' : 'text-foreground hover:bg-accent'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" /> My Account
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/auth/login" onClick={closeMobileMenu}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/auth/signup" onClick={closeMobileMenu}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
