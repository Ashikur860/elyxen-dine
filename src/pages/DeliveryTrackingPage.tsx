import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Phone, Clock, Star, ChevronRight,
  Package, ChefHat, Bike, Home, CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const STEPS = [
  { key: 'confirmed', icon: Package, label: 'Order Confirmed', desc: 'Restaurant received your order' },
  { key: 'preparing', icon: ChefHat, label: 'Being Prepared', desc: 'Chef is crafting your meal' },
  { key: 'picked_up', icon: Bike, label: 'Out for Delivery', desc: 'Rider picked up your order' },
  { key: 'delivered', icon: Home, label: 'Delivered', desc: 'Enjoy your meal!' },
]

export function DeliveryTrackingPage() {
  const { orderId } = useParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [eta, setEta] = useState(28)

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const displayOrderId = orderId || '#ELX1290'

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="bg-gradient-to-b from-muted/30 to-background border-b border-border/50 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
            <Link to="/dashboard/orders" className="hover:text-amber-500 transition-colors">Orders</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{displayOrderId}</span>
          </div>
          <h1 className="font-display text-3xl font-bold">Track Your Order</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* ETA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-3xl p-8 text-center border',
            currentStep >= 3
              ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20'
              : 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20'
          )}
        >
          {currentStep < 3 ? (
            <>
              <p className="text-muted-foreground text-sm mb-2">Estimated Arrival</p>
              <p className="font-display text-6xl font-bold text-amber-500 mb-2">
                {eta}<span className="text-3xl ml-1">min</span>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Live tracking active
              </div>
            </>
          ) : (
            <>
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="font-display text-2xl font-bold text-emerald-400 mb-1">Order Delivered!</p>
              <p className="text-muted-foreground text-sm">Enjoy your meal 🍽️</p>
            </>
          )}
        </motion.div>

        {/* Progress Steps */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <div className="space-y-0">
            {STEPS.map(({ key, icon: Icon, label, desc }, i) => {
              const isDone = i < currentStep
              const isActive = i === currentStep
              const isPending = i > currentStep
              return (
                <div key={key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0',
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive ? 'bg-amber-500 border-amber-500 text-black shadow-gold-glow'
                          : 'bg-muted border-border text-muted-foreground'
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </motion.div>
                    {i < STEPS.length - 1 && (
                      <div className={cn(
                        'w-0.5 h-8 my-1 transition-all duration-700',
                        isDone ? 'bg-emerald-500' : 'bg-border'
                      )} />
                    )}
                  </div>
                  <div className={cn(
                    'pb-8 last:pb-0 pt-1.5',
                    isPending ? 'opacity-40' : ''
                  )}>
                    <p className={cn(
                      'font-semibold text-sm leading-none mb-1',
                      isActive ? 'text-amber-500' : isDone ? 'text-emerald-400' : 'text-foreground'
                    )}>
                      {label}
                      {isActive && (
                        <span className="ml-2 text-xs text-amber-500/70 font-normal">· In progress</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rider Info */}
        {currentStep >= 2 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-5"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Rider</p>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-amber-500/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">Alex Rodriguez</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">4.9</span>
                    <span className="text-xs text-muted-foreground">· 2,341 deliveries</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2.5">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Rider is <span className="font-semibold text-foreground">1.2 km</span> away · Est. {eta} min</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Order Summary */}
        <div className="bg-card border border-border/50 rounded-2xl p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Order Details</p>
          <div className="space-y-2 mb-4">
            {[
              { name: 'Premium Wagyu Ramen', qty: 1, price: '$34.99' },
              { name: 'Dragon Roll Platter', qty: 2, price: '$57.98' },
              { name: 'Matcha Tiramisu', qty: 1, price: '$12.99' },
            ].map(({ name, qty, price }) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">×{qty} {name}</span>
                <span className="font-medium">{price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 pt-3 flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-amber-500">$108.95</span>
          </div>
        </div>

        {/* Dev controls (remove in production) */}
        <div className="bg-muted/30 border border-border/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Controls:</p>
          <div className="flex gap-2 flex-wrap">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg border transition-all',
                  currentStep === i ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-border hover:border-amber-500/30'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
