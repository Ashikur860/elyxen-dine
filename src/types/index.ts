export type { Database, UserRole, OrderStatus, ReservationStatus, DeliveryStatus } from '@/integrations/supabase/types'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  role: 'customer' | 'admin' | 'restaurant_manager'
  created_at: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine_type: string
  rating: number
  review_count: number
  price_range: string
  image_url: string
  cover_url: string | null
  address: string
  city: string
  phone: string
  email: string
  is_open: boolean
  delivery_time: string
  delivery_fee: number
  minimum_order: number
  is_featured: boolean
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string | null
  restaurant_id: string | null
  sort_order: number
}

export interface Food {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  restaurant_id: string
  is_available: boolean
  is_featured: boolean
  is_vegetarian: boolean
  is_spicy: boolean
  rating: number
  review_count: number
  preparation_time: number
  calories: number | null
  tags: string[]
  restaurant?: Restaurant
  category?: Category
}

export interface CartItem {
  id: string
  food: Food
  quantity: number
  special_instructions?: string
  restaurant_id: string
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  status: string
  total_amount: number
  delivery_fee: number
  discount_amount: number
  delivery_address: DeliveryAddress
  payment_method: string
  payment_status: string
  notes: string | null
  estimated_delivery: string | null
  created_at: string
  restaurant?: Restaurant
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  food_id: string
  quantity: number
  unit_price: number
  total_price: number
  special_instructions: string | null
  food?: Food
}

export interface Reservation {
  id: string
  user_id: string
  restaurant_id: string
  date: string
  time: string
  guest_count: number
  status: string
  special_requests: string | null
  confirmation_code: string
  created_at: string
  restaurant?: Restaurant
}

export interface Review {
  id: string
  user_id: string
  restaurant_id: string | null
  food_id: string | null
  rating: number
  comment: string | null
  created_at: string
  user?: User
}

export interface DeliveryAddress {
  street: string
  city: string
  state: string
  zip: string
  country: string
  notes?: string
}

export interface DeliveryTracking {
  id: string
  order_id: string
  status: string
  notes: string | null
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  action_url: string | null
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_order: number
  expires_at: string | null
  is_active: boolean
}

export interface Favorite {
  id: string
  user_id: string
  food_id: string | null
  restaurant_id: string | null
  created_at: string
  food?: Food
  restaurant?: Restaurant
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface StatsCard {
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: string
}
