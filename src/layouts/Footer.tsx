import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, MessageCircle, Share2, Play, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const FOOTER_LINKS = {
  Platform: [
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'Reservation', href: '/reservation' },
    { label: 'Track Order', href: '/dashboard/orders' },
    { label: 'Gift Cards', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

const SOCIAL_LINKS = [
  { icon: Globe, href: '#', label: 'Instagram' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Share2, href: '#', label: 'Facebook' },
  { icon: Play, href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Newsletter */}
        <div className="py-12 md:py-16 border-b border-border/50">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Stay in the <span className="gradient-text">loop</span>
              </h3>
              <p className="text-muted-foreground">
                Get exclusive offers, new restaurant alerts, and curated dining experiences delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="flex-1"
              />
              <Button className="shrink-0 gap-1.5">
                Subscribe <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-gold-glow">
                <span className="text-black font-bold">E</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl leading-none block">ElyXen</span>
                <span className="text-amber-500 text-sm font-medium leading-none">Dine</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              The luxury restaurant & cafe platform connecting you with the finest dining experiences. Order, reserve, and explore.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <span>hello@elyxendine.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <span>+1 (800) ELYXEN-1</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>New York, NY 10001</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ElyXen Dine. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
