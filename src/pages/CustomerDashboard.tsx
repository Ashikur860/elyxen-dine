import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import type { Reservation } from '@/types'
import {
  ShoppingBag, CalendarDays, Heart, MapPin, Bell, Settings,
  TrendingUp, Clock, Star, ChevronRight, Package, LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'
import { getInitials, formatCurrency, formatRelativeTime } from '@/lib/utils'
import { ORDER_STATUSES } from '@/constants'
import { cn } from '@/lib/utils'
import { MOCK_RESTAURANTS } from '@/constants'

const MOCK_ORDERS = [
  { id: '#ELX001', restaurant: 'Sakura Fine Japanese', items: 3, total: 89.97, status: 'delivered', date: '2026-05-18T14:30:00' },
  { id: '#ELX002', restaurant: 'La Bella Trattoria', items: 2, total: 54.98, status: 'on_the_way', date: '2026-05-20T12:00:00' },
  { id: '#ELX003', restaurant: 'The Golden Spice', items: 4, total: 72.96, status: 'preparing', date: '2026-05-20T13:45:00' },
]

const MOCK_RESERVATIONS = [
  { id: 'RES001', restaurant: 'Le Petit Bistro', date: '2026-05-25', time: '07:00 PM', guests: 2, status: 'confirmed', code: 'ELX2K9P' },
  { id: 'RES002', restaurant: 'Athens Mediterranean', date: '2026-06-01', time: '08:00 PM', guests: 4, status: 'pending', code: 'ELX8M3Q' },
]

const STAT_CARDS = [
  { label: 'Total Orders', value: 24, icon: ShoppingBag, trend: '+3 this month', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Reservations', value: 8, icon: CalendarDays, trend: '2 upcoming', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Favorites', value: 12, icon: Heart, trend: '5 restaurants', color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'Points Earned', value: '2,480', icon: Star, trend: 'Gold member', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
]

interface Props {
  defaultTab?: string
}

export function CustomerDashboard({ defaultTab = 'orders' }: Props) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [resLoading, setResLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data } = await (supabase.from('reservations') as any)
        .select('*, restaurants(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      setReservations(data || [])
      setResLoading(false)
    }
    load()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const displayUser = user || {
    full_name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar_url: null,
    role: 'customer',
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-muted/20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-amber-500/30">
              <AvatarImage src={displayUser.avatar_url || ''} />
              <AvatarFallback className="text-xl">{getInitials(displayUser.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold">Welcome back, {displayUser.full_name.split(' ')[0]} 👋</h1>
              <p className="text-muted-foreground text-sm">{displayUser.email}</p>
              <Badge variant="premium" className="mt-1">Gold Member ✦</Badge>
            </div>
          </div>

          {/* Loyalty Points Progress */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold">Loyalty Points</p>
                <p className="text-xs text-muted-foreground">2,480 / 5,000 for Platinum</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-amber-500">2,480</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
            <Progress value={49.6} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">2,520 more points to reach Platinum tier</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, trend, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-5"
            >
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon className={cn('h-5 w-5', color)} />
              </div>
              <p className="text-2xl font-display font-bold mb-0.5">{value}</p>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={cn('text-xs font-medium', color)}>{trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="orders" className="gap-2"><Package className="h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2"><CalendarDays className="h-4 w-4" />Reservations</TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2"><Heart className="h-4 w-4" />Favorites</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" />Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-3">
              {MOCK_ORDERS.map((order, i) => {
                const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || { label: order.status, color: 'gray' }
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border/50 rounded-2xl p-5 hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm">{order.restaurant}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.id} · {order.items} items · {formatCurrency(order.total)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={cn(
                            'text-xs',
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            order.status === 'on_the_way' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          )}
                          variant="outline"
                        >
                          {statusInfo.label}
                        </Badge>
                        {order.status !== 'delivered' && (
                          <Link to={`/orders/${order.id.replace('#','')}/track`}>
                            <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                              Track <ChevronRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                        {order.status === 'delivered' && (
                          <Button size="sm" variant="ghost" className="text-xs h-7 text-amber-500 gap-1">
                            <Star className="h-3 w-3" /> Rate
                          </Button>
                        )}
                      </div>
                    </div>

                    {order.status === 'on_the_way' && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">On the way · Est. 12 mins</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {['Received', 'Preparing', 'Picked Up', 'On The Way', 'Delivered'].map((s, idx) => (
                            <div key={s} className="flex items-center flex-1">
                              <div className={cn(
                                'h-2 w-2 rounded-full flex-shrink-0',
                                idx <= 3 ? 'bg-blue-400' : 'bg-border'
                              )} />
                              {idx < 4 && <div className={cn('h-0.5 flex-1', idx < 3 ? 'bg-blue-400' : 'bg-border')} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
              <Link to="/restaurants">
                <Button variant="outline" className="w-full mt-2">
                  Order Again from Your Favorites
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_RESTAURANTS.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-amber-500/20 hover:shadow-card-hover transition-all group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors">
                      <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                    </button>
                    <Badge variant={r.is_open ? 'success' : 'danger'} className="absolute bottom-3 left-3 text-xs">
                      {r.is_open ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold mb-0.5">{r.name}</p>
                    <p className="text-xs text-muted-foreground mb-3">{r.cuisine_type} · {r.delivery_time}</p>
                    <Link to={`/restaurants/${r.id}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        Order Now <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations">
            <div className="space-y-3">
              {resLoading ? (
                [1,2].map((i) => (
                  <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  </div>
                ))
              ) : reservations.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground">No reservations yet</p>
                </div>
              ) : (
                reservations.map((res, i) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border/50 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <CalendarDays className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{res.restaurant?.name || 'Restaurant'}</p>
                          <p className="text-sm text-muted-foreground">{res.date} · {res.time} · {res.guest_count} guests</p>
                          <p className="text-xs text-amber-500 font-semibold mt-1">Code: {res.confirmation_code}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        )}
                      >
                        {res.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
              <Link to="/reservation">
                <Button className="w-full mt-2 gap-2">
                  <CalendarDays className="h-4 w-4" /> Make a New Reservation
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="space-y-3">
              {[
                { icon: '🍽️', title: 'Your order has been delivered!', body: 'Order #ELX001 from Sakura Fine Japanese was delivered.', time: '2h ago', read: false },
                { icon: '🎉', title: 'Special offer just for you!', body: 'Use ELYXEN20 for 20% off your next order.', time: '1d ago', read: false },
                { icon: '✅', title: 'Reservation Confirmed', body: 'Your table at Le Petit Bistro on May 25th is confirmed.', time: '2d ago', read: true },
                { icon: '⭐', title: 'Earn double points this weekend!', body: 'Place any order Friday-Sunday to earn 2x loyalty points.', time: '3d ago', read: true },
              ].map((notif, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'flex gap-4 p-5 rounded-2xl border transition-all',
                    !notif.read ? 'border-amber-500/20 bg-amber-500/5' : 'border-border/50 bg-card'
                  )}
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl flex-shrink-0">{notif.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-display font-bold mb-5">Personal Information</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: displayUser.full_name, placeholder: 'Your full name' },
                    { label: 'Email', value: displayUser.email, placeholder: 'your@email.com' },
                    { label: 'Phone', value: '', placeholder: '+1 (555) 000-0000' },
                  ].map(({ label, value, placeholder }) => (
                    <div key={label}>
                      <label className="text-sm font-medium mb-1.5 block">{label}</label>
                      <input
                        defaultValue={value}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      />
                    </div>
                  ))}
                  <Button className="w-full">Save Changes</Button>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-display font-bold mb-5">Saved Addresses</h3>
                <div className="space-y-3 mb-4">
                  {[
                    { label: 'Home', address: '123 Main St, New York, NY 10001', icon: '🏠' },
                    { label: 'Office', address: '456 Park Ave, New York, NY 10022', icon: '🏢' },
                  ].map(({ label, address, icon }) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-muted/30">
                      <span className="text-xl">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground truncate">{address}</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <MapPin className="h-4 w-4" /> Add New Address
                </Button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-card border border-destructive/20 rounded-2xl p-6">
              <h3 className="font-display font-bold mb-2 text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">Sign out of your account on this device.</p>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
