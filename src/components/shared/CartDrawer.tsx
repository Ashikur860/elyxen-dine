import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatCurrency } from '@/lib/utils'

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore()
  const { items, updateQuantity, removeItem, getTotalPrice, getDeliveryFee, clearCart } = useCartStore()

  const subtotal = getTotalPrice()
  const deliveryFee = getDeliveryFee()
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base">Your Cart</h2>
                  <p className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="h-8 w-8 rounded-xl hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                  <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-base mb-1">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add items from restaurants to get started</p>
                  </div>
                  <Button onClick={closeCart} variant="outline" asChild>
                    <Link to="/restaurants">Browse Restaurants</Link>
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-2xl border border-border/50 bg-background/50"
                      >
                        <img
                          src={item.food.image_url}
                          alt={item.food.name}
                          className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm leading-tight line-clamp-1">{item.food.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.food.price)} each</p>
                          {item.special_instructions && (
                            <p className="text-xs text-amber-500 mt-0.5 line-clamp-1">"{item.special_instructions}"</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-border rounded-xl overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{formatCurrency(item.food.price * item.quantity)}</span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors text-muted-foreground"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                {/* Coupon */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <input placeholder="Add coupon code" className="bg-transparent flex-1 outline-none text-sm" />
                  </div>
                  <Button size="sm" variant="outline">Apply</Button>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery fee</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-500 font-medium' : ''}>
                      {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-amber-500">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button className="w-full gap-2" size="lg" asChild onClick={closeCart}>
                  <Link to="/checkout">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
