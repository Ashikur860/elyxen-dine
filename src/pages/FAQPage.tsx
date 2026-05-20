import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQ_DATA = [
  {
    category: 'Ordering',
    items: [
      { q: 'How do I place an order?', a: 'Browse our restaurant listings, select a restaurant, add items to your cart, and proceed to checkout. Payment is processed securely through our platform.' },
      { q: 'Can I order from multiple restaurants at once?', a: 'Currently, each order must be from a single restaurant. This ensures your food arrives fresh and hot from one kitchen.' },
      { q: 'How do I apply a coupon code?', a: 'At checkout, you\'ll find a coupon code field in the order summary. Enter your code and click "Apply" to see the discount reflected in your total.' },
      { q: 'Can I modify my order after placing it?', a: 'Orders can be modified within 2 minutes of placement. After the restaurant confirms your order, changes are no longer possible.' },
    ],
  },
  {
    category: 'Delivery',
    items: [
      { q: 'What are the delivery hours?', a: 'Delivery is available from 10am–11pm daily. Individual restaurant hours may vary and are displayed on each restaurant\'s page.' },
      { q: 'How do I track my delivery?', a: 'Once your order is picked up, you\'ll receive real-time tracking updates in the app and via email/SMS notifications.' },
      { q: 'What if my order is late?', a: 'If your order exceeds the estimated delivery time by more than 15 minutes, please contact our support team for a delivery credit.' },
      { q: 'Is there a minimum order amount?', a: 'Minimum order amounts vary by restaurant (typically $15–$30). These are displayed before you begin ordering.' },
    ],
  },
  {
    category: 'Reservations',
    items: [
      { q: 'How do I make a reservation?', a: 'Visit the Reservation page, select your restaurant, date, time, and guest count, then enter your details. You\'ll receive a confirmation code immediately.' },
      { q: 'Can I cancel or modify a reservation?', a: 'Reservations can be cancelled up to 2 hours before the booking time at no charge. Modifications can be made up to 4 hours before.' },
      { q: 'Is there a reservation fee?', a: 'Making a reservation on ElyXen Dine is completely free. Some restaurants may require a deposit for large groups (8+ guests).' },
    ],
  },
  {
    category: 'Account & Payments',
    items: [
      { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, digital wallets (Apple Pay, Google Pay), and cash on delivery for eligible orders.' },
      { q: 'How do loyalty points work?', a: 'Earn 1 point per $1 spent. Points accumulate to unlock Silver (500pts), Gold (2,000pts), and Platinum (5,000pts) status with exclusive benefits.' },
      { q: 'Is my payment information secure?', a: 'Yes. All transactions are encrypted using 256-bit SSL technology. We never store your full card details on our servers.' },
    ],
  },
]

export function FAQPage() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = FAQ_DATA.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50 py-16 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Support</p>
            <h1 className="font-display text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <div className="flex items-center gap-2 border border-border bg-background rounded-2xl px-4 py-3 max-w-md mx-auto mt-6 focus-within:border-amber-500/50 transition-colors">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-14 space-y-10">
        {filtered.map((cat, catI) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catI * 0.1 }}
          >
            <h2 className="font-display text-xl font-bold mb-4 text-amber-500">{cat.category}</h2>
            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const id = `${cat.category}-${i}`
                const isOpen = openId === id
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-2xl border transition-all duration-200 overflow-hidden',
                      isOpen ? 'border-amber-500/30 bg-amber-500/5' : 'border-border/50 bg-card'
                    )}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                    >
                      <span className="font-medium text-sm">{item.q}</span>
                      <ChevronDown className={cn('h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-amber-500')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg">No results found</p>
            <p className="text-muted-foreground text-sm mt-1">Try a different search term</p>
          </div>
        )}

        <div className="text-center py-8 border-t border-border/50">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a href="/contact">
            <button className="btn-primary">Contact Support</button>
          </a>
        </div>
      </div>
    </div>
  )
}
