import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Clock, Users, ChevronRight, CheckCircle2,
  MapPin, Star, Utensils,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MOCK_RESTAURANTS, TIME_SLOTS } from '@/constants'
import { cn, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

const reservationSchema = z.object({
  restaurantId: z.string().min(1, 'Please select a restaurant'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time slot'),
  guests: z.string().min(1, 'Please select guest count'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number required'),
  requests: z.string().optional(),
})

type ReservationForm = z.infer<typeof reservationSchema>

const STEPS = ['Restaurant', 'Date & Time', 'Details', 'Confirm']

export function ReservationPage() {
  const [step, setStep] = useState(0)
  const [selectedTime, setSelectedTime] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [confirmCode, setConfirmCode] = useState(() => 'ELX' + Math.random().toString(36).substring(2, 7).toUpperCase())
  const { user } = useAuth()

  const {
    register, handleSubmit, watch, setValue, trigger,
    formState: { errors, isSubmitting },
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.full_name || '',
      email: user?.email || '',
    },
  })

  // Register controller fields that use setValue (not native inputs)
  register('time')
  register('guests')

  const watchedRestaurant = watch('restaurantId')
  const watchedDate = watch('date')
  const watchedGuests = watch('guests')
  const selectedRestaurant = MOCK_RESTAURANTS.find((r) => r.id === watchedRestaurant)

  const today = new Date().toISOString().split('T')[0]

  const goNext = async () => {
    const fields: (keyof ReservationForm)[][] = [
      ['restaurantId'],
      ['date', 'time', 'guests'],
      ['name', 'email', 'phone'],
    ]
    const valid = await trigger(fields[step])
    if (valid) setStep((s) => Math.min(s + 1, 3))
  }

  const onSubmit = async (data: ReservationForm) => {
    try {
      if (user) {
        // Save to Supabase
        const { data: res, error } = await (supabase.from('reservations') as any).insert({
          user_id: user.id,
          restaurant_id: data.restaurantId,
          date: data.date,
          time: data.time,
          guest_count: parseInt(data.guests),
          special_requests: data.requests || null,
          status: 'confirmed',
        }).select().single()

        if (error) throw error
        if (res?.confirmation_code) setConfirmCode(res.confirmation_code)
      } else {
        // Not logged in — simulate
        await new Promise((r) => setTimeout(r, 1200))
      }
      setConfirmed(true)
      toast.success('Reservation confirmed! 🎉', { description: `Code: ${confirmCode}` })
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.')
    }
  }

  if (confirmed) {
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
          <h1 className="font-display text-3xl font-bold mb-3">Reservation Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your table has been reserved at <span className="text-foreground font-semibold">{selectedRestaurant?.name}</span>.
            A confirmation has been sent to your email.
          </p>
          <div className="bg-card border border-border/50 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confirmation Code</p>
              <p className="font-display text-3xl font-bold text-amber-500">{confirmCode}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Date</p>
                <p className="font-semibold">{watchedDate ? formatDate(watchedDate) : '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Time</p>
                <p className="font-semibold">{selectedTime || '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Guests</p>
                <p className="font-semibold">{watchedGuests || '--'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setConfirmed(false); setStep(0) }}>
              New Reservation
            </Button>
            <Button className="flex-1" onClick={() => window.location.href = '/dashboard/reservations'}>
              View Reservations
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50 py-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Table Booking</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Reserve Your Table</h1>
          <p className="text-muted-foreground">Book a premium dining experience in seconds</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  i < step ? 'bg-emerald-500 text-white'
                    : i === step ? 'bg-amber-500 text-black shadow-gold-glow'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </div>
                <span className={cn(
                  'text-xs mt-1 font-medium hidden sm:block',
                  i === step ? 'text-amber-500' : 'text-muted-foreground'
                )}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'h-0.5 w-12 md:w-20 mx-2 transition-all duration-500',
                  i < step ? 'bg-emerald-500' : 'bg-border'
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 0 - Restaurant */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold mb-6">Choose a Restaurant</h2>
                <div className="grid gap-3">
                  {MOCK_RESTAURANTS.filter((r) => r.is_open).map((r) => (
                    <label
                      key={r.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all',
                        watchedRestaurant === r.id
                          ? 'border-amber-500 bg-amber-500/5 shadow-gold-glow'
                          : 'border-border hover:border-amber-500/30'
                      )}
                    >
                      <input
                        type="radio"
                        value={r.id}
                        className="sr-only"
                        {...register('restaurantId')}
                        onChange={(e) => setValue('restaurantId', e.target.value, { shouldValidate: true })}
                      />
                      <img src={r.image_url} alt={r.name} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-sm text-muted-foreground">{r.cuisine_type}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {r.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {r.city}
                          </div>
                        </div>
                      </div>
                      <div className={cn(
                        'h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                        watchedRestaurant === r.id ? 'border-amber-500' : 'border-muted-foreground'
                      )}>
                        {watchedRestaurant === r.id && <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.restaurantId && <p className="text-sm text-destructive">{errors.restaurantId.message}</p>}
              </motion.div>
            )}

            {/* Step 1 - Date & Time */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-display text-xl font-bold mb-6">Select Date & Time</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-amber-500" /> Date
                    </label>
                    <Input type="date" min={today} error={errors.date?.message} {...register('date')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-amber-500" /> Guests
                    </label>
                    <Select onValueChange={(v) => { setValue('guests', v, { shouldValidate: true }) }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,10,12].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} {n === 1 ? 'guest' : 'guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guests && <p className="text-xs text-destructive mt-1">{errors.guests.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-500" /> Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setSelectedTime(time)
                          setValue('time', time, { shouldValidate: true })
                        }}
                        className={cn(
                          'py-2.5 rounded-xl border text-sm font-medium transition-all',
                          selectedTime === time
                            ? 'bg-amber-500 text-black border-amber-500 shadow-gold-glow'
                            : 'border-border hover:border-amber-500/30'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-xs text-destructive mt-2">{errors.time.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 2 - Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold mb-6">Your Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <Input placeholder="John Doe" error={errors.name?.message} {...register('name')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                    <Input type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" error={errors.phone?.message} {...register('phone')} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Special Requests <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    placeholder="Allergies, dietary requirements, special occasions..."
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                    {...register('requests')}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-xl font-bold mb-6">Review & Confirm</h2>
                {selectedRestaurant && (
                  <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-6">
                    <div className="flex items-center gap-4 p-5 border-b border-border/50">
                      <img src={selectedRestaurant.image_url} alt={selectedRestaurant.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div>
                        <p className="font-display font-bold">{selectedRestaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedRestaurant.cuisine_type}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {selectedRestaurant.address}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-border/50">
                      {[
                        { icon: CalendarDays, label: 'Date', value: watchedDate ? formatDate(watchedDate) : '--' },
                        { icon: Clock, label: 'Time', value: selectedTime || '--' },
                        { icon: Users, label: 'Guests', value: watchedGuests ? `${watchedGuests} guests` : '--' },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="p-4 text-center">
                          <Icon className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                          <p className="text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
                  <Utensils className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-500 mb-1">Free Cancellation</p>
                    <p className="text-muted-foreground">Cancel up to 2 hours before your reservation at no charge.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-10">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={goNext} className="flex-1 gap-1.5">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 gap-2" isLoading={isSubmitting}>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Reservation
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
