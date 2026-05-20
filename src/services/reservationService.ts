import { supabase } from '@/integrations/supabase/client'
import type { Reservation } from '@/types'

interface CreateReservationParams {
  userId: string
  restaurantId: string
  date: string
  time: string
  guestCount: number
  specialRequests?: string
}

export const reservationService = {
  async create(params: CreateReservationParams): Promise<Reservation> {
    const { data, error } = await (supabase.from('reservations') as any).insert({
      user_id: params.userId,
      restaurant_id: params.restaurantId,
      date: params.date,
      time: params.time,
      guest_count: params.guestCount,
      special_requests: params.specialRequests ?? null,
      status: 'confirmed',
    }).select().single()

    if (error) throw error
    return data as Reservation
  },

  async getUserReservations(userId: string): Promise<Reservation[]> {
    const { data, error } = await (supabase.from('reservations') as any)
      .select('*, restaurants(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    if (error) throw error
    return data as Reservation[]
  },

  async cancel(reservationId: string): Promise<void> {
    const { error } = await (supabase.from('reservations') as any)
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
    if (error) throw error
  },
}
