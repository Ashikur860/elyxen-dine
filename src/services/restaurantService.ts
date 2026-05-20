import { supabase } from '@/integrations/supabase/client'
import type { Restaurant, Food } from '@/types'

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('rating', { ascending: false })
    if (error) throw error
    return data as unknown as Restaurant[]
  },

  async getFeatured(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_featured', true)
      .eq('is_open', true)
      .limit(6)
    if (error) throw error
    return data as unknown as Restaurant[]
  },

  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as unknown as Restaurant
  },

  async search(query: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .or(`name.ilike.%${query}%,cuisine_type.ilike.%${query}%,description.ilike.%${query}%`)
    if (error) throw error
    return data as unknown as Restaurant[]
  },
}

export const foodService = {
  async getByRestaurant(restaurantId: string): Promise<Food[]> {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('is_featured', { ascending: false })
    if (error) throw error
    return data as unknown as Food[]
  },

  async getFeatured(): Promise<Food[]> {
    const { data, error } = await supabase
      .from('foods')
      .select('*, restaurants(*)')
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(8)
    if (error) throw error
    return data as unknown as Food[]
  },
}
