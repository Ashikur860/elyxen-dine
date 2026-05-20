import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Food } from '@/types'

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  addItem: (food: Food, quantity?: number, instructions?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getDeliveryFee: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (food, quantity = 1, instructions) => {
        const { items, restaurantId } = get()

        if (restaurantId && restaurantId !== food.restaurant_id) {
          if (!confirm('Adding this item will clear your current cart from a different restaurant. Continue?')) {
            return
          }
          set({ items: [], restaurantId: null })
        }

        const existingItem = items.find((item) => item.food.id === food.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.food.id === food.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          const newItem: CartItem = {
            id: `${food.id}-${Date.now()}`,
            food,
            quantity,
            special_instructions: instructions,
            restaurant_id: food.restaurant_id,
          }
          set({
            items: [...items, newItem],
            restaurantId: food.restaurant_id,
          })
        }
      },

      removeItem: (itemId) => {
        const items = get().items.filter((item) => item.id !== itemId)
        set({ items, restaurantId: items.length === 0 ? null : get().restaurantId })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [], restaurantId: null }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.food.price * item.quantity, 0),

      getDeliveryFee: () => {
        const total = get().getTotalPrice()
        return total > 50 ? 0 : 2.99
      },
    }),
    {
      name: 'elyxen-cart',
    }
  )
)
