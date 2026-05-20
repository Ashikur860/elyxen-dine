import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, ArrowRight, MapPin, Star, Clock, Shield,
  ChevronRight, Zap, Award, TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { FoodCard } from '@/components/cards/FoodCard'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { StarRating } from '@/components/shared/StarRating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MOCK_RESTAURANTS, MOCK_FOODS, MOCK_TESTIMONIALS, FOOD_CATEGORIES } from '@/constants'
import { cn } from '@/lib/utils'

const STATS = [
  { value: 500, suffix: '+', label: 'Premium Restaurants', icon: Award },
  { value: 2, suffix: 'M+', label: 'Happy Customers', icon: Star },
  { value: 15, suffix: 'M+', label: 'Orders Delivered', icon: TrendingUp },
  { value: 99, suffix: '%', label: 'Satisfaction Rate', icon: Shield },
]

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="pb-16 md:pb-0">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-background">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />

        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Floating food images */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[5%] top-1/4 hidden lg:block"
        >
          <div className="h-64 w-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-amber-500/20 rotate-6">
            <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80" alt="Food" className="h-full w-full object-cover" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[20%] top-[15%] hidden lg:block"
        >
          <div className="h-40 w-40 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10 -rotate-3">
            <img src="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=80" alt="Food" className="h-full w-full object-cover" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute right-[8%] bottom-[20%] hidden lg:block"
        >
          <div className="h-48 w-48 rounded-2xl overflow-hidden shadow-xl ring-2 ring-amber-500/10 rotate-2">
            <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80" alt="Food" className="h-full w-full object-cover" />
          </div>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-24 lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>The Luxury Dining Platform</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Extraordinary{' '}
              <span className="gradient-text">Dining</span>
              <br />
              at Your Fingertips
            </h1>

            <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
              Discover premium restaurants, order with elegance, and reserve your perfect table — all in one sophisticated platform.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-xl">
              <div className="flex-1 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 focus-within:border-amber-500/50 transition-colors">
                <Search className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder:text-zinc-400 outline-none text-sm"
                />
                <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  New York
                </div>
              </div>
              <Button type="submit" size="lg" className="shrink-0 rounded-2xl">
                Search
              </Button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Button variant="premium" size="lg" asChild>
                <Link to="/restaurants" className="gap-2">
                  Explore Restaurants <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/reservation">Book a Table</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                ].map((src, i) => (
                  <img key={i} src={src} alt="user" className="h-8 w-8 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">Trusted by 2M+ foodies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, suffix, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold mb-1">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY FILTERS ─── */}
      <section className="py-10 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {FOOD_CATEGORIES.map(({ id, name, emoji }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium whitespace-nowrap transition-all',
                  selectedCategory === id
                    ? 'bg-amber-500 text-black border-amber-500 shadow-gold-glow'
                    : 'border-border bg-card hover:border-amber-500/30 hover:bg-amber-500/5'
                )}
              >
                <span className="text-lg">{emoji}</span>
                {name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED RESTAURANTS ─── */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Curated Selection</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Featured Restaurants</h2>
            </div>
            <Link to="/restaurants" className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-500 transition-colors font-medium">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_RESTAURANTS.filter((r) => r.is_featured).map((restaurant, i) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} variant="featured" />
            ))}
          </div>
          <div className="mt-6 md:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/restaurants">View All Restaurants <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── POPULAR FOODS ─── */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Trending Now</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Popular Dishes</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {MOCK_FOODS.map((food, i) => (
              <FoodCard key={food.id} food={food} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Bento) ─── */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Simple & Elegant</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Dining made effortless</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Three simple steps to an extraordinary dining experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'Browse our curated selection of premium restaurants and cafes across the city',
                icon: '🔍',
                color: 'from-amber-500/20 to-orange-500/5',
              },
              {
                step: '02',
                title: 'Order or Reserve',
                description: 'Add items to your cart or book a table with our seamless reservation system',
                icon: '🍽️',
                color: 'from-blue-500/20 to-purple-500/5',
              },
              {
                step: '03',
                title: 'Enjoy',
                description: 'Track your delivery in real-time or walk in to your reserved table',
                icon: '✨',
                color: 'from-emerald-500/20 to-teal-500/5',
              },
            ].map(({ step, title, description, icon, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  'relative p-8 rounded-3xl border border-border/50 bg-gradient-to-br overflow-hidden group hover:border-amber-500/20 transition-all duration-300',
                  color
                )}
              >
                <div className="text-5xl mb-6">{icon}</div>
                <div className="absolute top-6 right-6 font-display text-6xl font-bold text-white/5 select-none">
                  {step}
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Social Proof</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Loved by food enthusiasts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-border/50 bg-card hover:border-amber-500/20 hover:shadow-lg transition-all duration-300"
              >
                <StarRating rating={testimonial.rating} size="sm" className="mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-0.5">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESERVATION CTA ─── */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-10 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-hero-pattern opacity-20" />
            <div className="relative z-10">
              <p className="text-black/70 font-semibold uppercase tracking-wider text-sm mb-3">Reserve Your Experience</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-black mb-4">
                Book your perfect table
              </h2>
              <p className="text-black/70 max-w-md mx-auto mb-8 leading-relaxed">
                Reserve a table at any of our premium restaurants with just a few taps. No waiting, no hassle.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  className="bg-black text-white hover:bg-black/80 shadow-2xl gap-2"
                  size="xl"
                  asChild
                >
                  <Link to="/reservation">
                    <CalendarDays className="h-5 w-5" />
                    Reserve a Table
                  </Link>
                </Button>
                <Button
                  variant="glass"
                  size="xl"
                  asChild
                >
                  <Link to="/restaurants">Browse Restaurants</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── DELIVERY FEATURES ─── */}
      <section className="section-padding bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'Average 30 min delivery' },
              { icon: '🔒', title: 'Secure Payments', desc: '256-bit SSL encryption' },
              { icon: '📍', title: 'Live Tracking', desc: 'Real-time order updates' },
              { icon: '🎯', title: '100% Fresh', desc: 'Quality guaranteed always' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card"
              >
                <div className="text-3xl flex-shrink-0">{icon}</div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function CalendarDays({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  )
}
