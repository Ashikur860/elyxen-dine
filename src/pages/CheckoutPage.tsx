import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, CreditCard, CheckCircle2, ChevronRight, Tag, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

const checkoutSchema = z.object({
  street: z.string().min(5, 'Street address required'),
  city: z.string().min(2, 'City required'),
  zip: z.string().min(4, 'ZIP code required'),
  paymentMethod: z.enum(['card', 'cash', 'wallet']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotalPrice, getDeliveryFee, clearCart } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId] = useState(() => '#ELX' + Math.random().toString(36).substring(2, 8).toUpperCase())

  const subtotal = getTotalPrice()
  const deliveryFee = getDeliveryFee()
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax - discount

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'card' },
  })

  const paymentMethod = watch('paymentMethod')

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'ELYXEN20') {
      setDiscount(subtotal * 0.2)
      setCouponApplied(true)
      toast.success('Coupon applied! 20% off 🎉')
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.1)
      setCouponApplied(true)
      toast.success('Coupon applied! 10% off 🎉')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const onSubmit = async (_data: CheckoutForm) => {
    await new Promise((r) => setTimeout(r, 1500))
    clearCart()
    setOrderPlaced(true)
    toast.success('Order placed successfully! 🍽️')
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <div className="text-6xl mb-2">🛒</div>
        <h2 className="font-display text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add items from a restaurant to proceed to checkout</p>
        <Button asChild className="mt-2"><Link to="/restaurants">Browse Restaurants</Link></Button>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Order Placed!</h1>
          <p className="text-muted-foreground mb-2">Your order <span className="text-amber-500 font-bold">{orderId}</span> has been received.</p>
          <p className="text-muted-foreground mb-8">Estimated delivery: <span className="font-semibold text-foreground">30-45 minutes</span></p>

          <div className="bg-card border border-border/50 rounded-2xl p-6 mb-6 space-y-4">
            {['Order Received', 'Being Prepared', 'On The Way', 'Delivered'].map((status, i) => (
              <div key={status} className="flex items-center gap-3">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  i === 0 ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-border text-muted-foreground'
                )}>
                  {i === 0 ? <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" /> : i + 1}
                </div>
                <span className={cn('text-sm', i === 0 ? 'font-semibold text-amber-500' : 'text-muted-foreground')}>{status}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link to="/dashboard/orders">Track Order</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="bg-gradient-to-b from-muted/30 to-background border-b border-border/50 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" /> Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Street Address</label>
                    <Input placeholder="123 Main Street, Apt 4B" error={errors.street?.message} {...register('street')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">City</label>
                      <Input placeholder="New York" error={errors.city?.message} {...register('city')} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">ZIP Code</label>
                      <Input placeholder="10001" error={errors.zip?.message} {...register('zip')} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-500" /> Payment Method
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { id: 'card', label: 'Card', icon: '💳' },
                    { id: 'cash', label: 'Cash', icon: '💵' },
                    { id: 'wallet', label: 'Wallet', icon: '📱' },
                  ].map(({ id, label, icon }) => (
                    <label
                      key={id}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all',
                        paymentMethod === id
                          ? 'border-amber-500 bg-amber-500/5 shadow-gold-glow'
                          : 'border-border hover:border-amber-500/30'
                      )}
                    >
                      <input type="radio" value={id} className="sr-only" {...register('paymentMethod')} />
                      <span className="text-2xl">{icon}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <Input placeholder="Card Number (1234 5678 9012 3456)" {...register('cardNumber')} />
                    <Input placeholder="Cardholder Name" {...register('cardName')} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" {...register('cardExpiry')} />
                      <Input placeholder="CVV" {...register('cardCvv')} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-4">
              <div className="bg-card border border-border/50 rounded-2xl p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.food.image_url} alt={item.food.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.food.name}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(item.food.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Coupon */}
                {!couponApplied ? (
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 flex items-center gap-2 border border-border rounded-xl px-3">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm py-2.5"
                      />
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={applyCoupon}>Apply</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-emerald-500 font-medium">Coupon applied!</span>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <div className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Delivery</div>
                    <span className={deliveryFee === 0 ? 'text-emerald-500' : ''}>
                      {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-medium">
                      <span>Discount</span><span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base pt-1">
                    <span>Total</span>
                    <span className="text-amber-500">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-5 gap-2" size="lg" isLoading={isSubmitting}>
                  <CheckCircle2 className="h-4 w-4" />
                  Place Order · {formatCurrency(total)}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                  🔒 Secured by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
