export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'admin' | 'restaurant_manager'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type DeliveryStatus = 'preparing' | 'cooking' | 'picked_up' | 'on_the_way' | 'delivered'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
        }
        Update: {
          email?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
        }
      }
      restaurants: {
        Row: {
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
          opening_hours: Json
          is_open: boolean
          delivery_time: string
          delivery_fee: number
          minimum_order: number
          manager_id: string | null
          is_featured: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at' | 'rating' | 'review_count'>
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          description: string | null
          restaurant_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      foods: {
        Row: {
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
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['foods']['Row'], 'id' | 'created_at' | 'rating' | 'review_count'>
        Update: Partial<Database['public']['Tables']['foods']['Insert']>
      }
      carts: {
        Row: {
          id: string
          user_id: string
          food_id: string
          restaurant_id: string
          quantity: number
          special_instructions: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['carts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['carts']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          status: OrderStatus
          total_amount: number
          delivery_fee: number
          discount_amount: number
          coupon_id: string | null
          delivery_address: Json
          payment_method: string
          payment_status: string
          notes: string | null
          estimated_delivery: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          food_id: string
          quantity: number
          unit_price: number
          total_price: number
          special_instructions: string | null
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          date: string
          time: string
          guest_count: number
          status: ReservationStatus
          special_requests: string | null
          confirmation_code: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reservations']['Row'], 'id' | 'created_at' | 'confirmation_code'>
        Update: Partial<Database['public']['Tables']['reservations']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          food_id: string | null
          order_id: string | null
          rating: number
          comment: string | null
          images: string[] | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      delivery_tracking: {
        Row: {
          id: string
          order_id: string
          status: DeliveryStatus
          location: Json | null
          notes: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['delivery_tracking']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['delivery_tracking']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          minimum_order: number
          max_uses: number | null
          used_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'used_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          food_id: string | null
          restaurant_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      reservation_status: ReservationStatus
    }
  }
}
