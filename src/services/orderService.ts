import { supabase } from '@/integrations/supabase/client'
import type { Order, CartItem, DeliveryAddress } from '@/types'

interface PlaceOrderParams {
  userId: string
  restaurantId: string
  items: CartItem[]
  deliveryAddress: DeliveryAddress
  paymentMethod: string
  totalAmount: number
  deliveryFee: number
  discountAmount?: number
  notes?: string
}

export const orderService = {
  async placeOrder(params: PlaceOrderParams): Promise<Order> {
    const { data: order, error: orderError } = await (supabase.from('orders') as any).insert({
      user_id: params.userId,
      restaurant_id: params.restaurantId,
      status: 'confirmed',
      total_amount: params.totalAmount,
      delivery_fee: params.deliveryFee,
      discount_amount: params.discountAmount ?? 0,
      delivery_address: params.deliveryAddress,
      payment_method: params.paymentMethod,
      payment_status: 'paid',
      notes: params.notes ?? null,
      estimated_delivery: new Date(Date.now() + 35 * 60000).toISOString(),
    }).select().single()

    if (orderError) throw orderError

    const orderItems = params.items.map((item) => ({
      order_id: order.id,
      food_id: item.food.id,
      quantity: item.quantity,
      unit_price: item.food.price,
      total_price: item.food.price * item.quantity,
      special_instructions: item.special_instructions ?? null,
    }))

    const { error: itemsError } = await (supabase.from('order_items') as any).insert(orderItems)
    if (itemsError) throw itemsError

    return order as Order
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await (supabase.from('orders') as any)
      .select('*, restaurants(*), order_items(*, foods(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Order[]
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await (supabase.from('orders') as any)
      .select('*, restaurants(*), order_items(*, foods(*))')
      .eq('id', orderId)
      .single()
    if (error) return null
    return data as Order
  },

  subscribeToOrder(orderId: string, callback: (order: Partial<Order>) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, (payload) => callback(payload.new as Partial<Order>))
      .subscribe()
  },
}
