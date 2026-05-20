import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  LayoutDashboard, ShoppingBag, Users, DollarSign, Star,
  ArrowUp, ArrowDown, RefreshCw, CalendarDays,
  Search, CheckCircle, XCircle, Truck,
  Shield, UserCheck, ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency, cn, getInitials } from '@/lib/utils'

// ─── Static chart data ────────────────────────────────────────
const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, orders: 320 },
  { month: 'Feb', revenue: 38000, orders: 280 },
  { month: 'Mar', revenue: 51000, orders: 410 },
  { month: 'Apr', revenue: 47000, orders: 370 },
  { month: 'May', revenue: 63000, orders: 490 },
  { month: 'Jun', revenue: 58000, orders: 450 },
  { month: 'Jul', revenue: 72000, orders: 520 },
]
const CUISINE_DATA = [
  { name: 'Japanese', value: 28, color: '#f59e0b' },
  { name: 'Italian', value: 22, color: '#3b82f6' },
  { name: 'Indian', value: 18, color: '#10b981' },
  { name: 'Chinese', value: 16, color: '#8b5cf6' },
  { name: 'Other', value: 16, color: '#6b7280' },
]

const STATUS_COLOR: Record<string, string> = {
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  on_the_way: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  preparing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  confirmed: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  pending: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const ROLE_COLOR: Record<string, string> = {
  admin: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  customer: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  restaurant_manager: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold">
          {p.name === 'revenue' ? formatCurrency(p.value) : `${p.value} orders`}
        </p>
      ))}
    </div>
  )
}

type AdminTab = 'overview' | 'users' | 'orders' | 'reservations'

export function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [users, setUsers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchAll() }, [tab])

  async function fetchAll() {
    setLoading(true)
    if (tab === 'users') {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
    } else if (tab === 'orders') {
      const { data } = await (supabase.from('orders') as any).select('*, users(full_name, email)').order('created_at', { ascending: false }).limit(50)
      setOrders(data || [])
    } else if (tab === 'reservations') {
      const { data } = await (supabase.from('reservations') as any).select('*, users(full_name, email)').order('created_at', { ascending: false }).limit(50)
      setReservations(data || [])
    }
    setLoading(false)
  }

  async function updateUserRole(userId: string, role: string) {
    await (supabase.from('users') as any).update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await (supabase.from('orders') as any).update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  async function updateReservationStatus(resId: string, status: string) {
    await (supabase.from('reservations') as any).update({ status }).eq('id', resId)
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status } : r))
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredOrders = orders.filter(o =>
    o.id?.includes(orderSearch) ||
    o.users?.full_name?.toLowerCase().includes(orderSearch.toLowerCase())
  )

  const NAV = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  ] as const

  return (
    <div className="min-h-screen bg-muted/20 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border/50 px-4 md:px-6 py-5 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-none">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Welcome, {user?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={fetchAll}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Badge variant="success" className="gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Sidebar-style Tab Nav */}
        <div className="flex gap-1 mb-6 bg-card border border-border/50 rounded-2xl p-1.5 w-fit">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as AdminTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                tab === id
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: '$372K', change: 18.2, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Total Orders', value: '10,770', change: 12.5, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Registered Users', value: users.length || '—', change: 9.1, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { label: 'Avg. Rating', value: '4.8', change: 0.3, icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map(({ label, value, change, icon: Icon, color, bg }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', bg)}>
                      <Icon className={cn('h-5 w-5', color)} />
                    </div>
                    <span className={cn('flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                      change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                      {change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(change)}%
                    </span>
                  </div>
                  <p className="text-2xl font-display font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground mb-4">Last 7 months</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#rg)" name="revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-display font-bold mb-1">By Cuisine</h3>
                <p className="text-sm text-muted-foreground mb-3">This month</p>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={CUISINE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {CUISINE_DATA.map(({ color }, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-1">
                  {CUISINE_DATA.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs text-muted-foreground">{name}</span>
                      </div>
                      <span className="text-xs font-semibold">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-display font-bold mb-1">Monthly Orders</h3>
              <p className="text-sm text-muted-foreground mb-4">Order volume</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={REVENUE_DATA} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} name="orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick links */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Manage Users', desc: 'View, promote, or change roles', tab: 'users', icon: Users, color: 'text-blue-400' },
                { label: 'Manage Orders', desc: 'Update status, view details', tab: 'orders', icon: ShoppingBag, color: 'text-amber-500' },
                { label: 'Reservations', desc: 'Confirm or cancel bookings', tab: 'reservations', icon: CalendarDays, color: 'text-purple-400' },
              ].map(({ label, desc, tab: t, icon: Icon, color }) => (
                <button key={t} onClick={() => setTab(t as AdminTab)}
                  className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl hover:border-amber-500/30 transition-all text-left group">
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-5 w-5', color)} />
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">User Management</h2>
              <span className="text-sm text-muted-foreground">{filteredUsers.length} users</span>
            </div>
            <Input placeholder="Search by name or email…" icon={<Search className="h-4 w-4" />}
              value={userSearch} onChange={e => setUserSearch(e.target.value)} />
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading users…</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No users found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>{['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatar_url} />
                                <AvatarFallback className="text-xs">{getInitials(u.full_name)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{u.full_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={cn('text-xs capitalize', ROLE_COLOR[u.role] || '')}>{u.role}</Badge>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              {u.role !== 'admin' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                                  onClick={() => updateUserRole(u.id, 'admin')}>
                                  <Shield className="h-3 w-3" /> Make Admin
                                </Button>
                              )}
                              {u.role !== 'customer' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                                  onClick={() => updateUserRole(u.id, 'customer')}>
                                  <UserCheck className="h-3 w-3" /> Customer
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Order Management</h2>
              <span className="text-sm text-muted-foreground">{filteredOrders.length} orders</span>
            </div>
            <Input placeholder="Search by order ID or customer…" icon={<Search className="h-4 w-4" />}
              value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading orders…</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No orders found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>{['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4 text-sm font-mono text-amber-500">{o.id.slice(0, 8)}…</td>
                          <td className="px-5 py-4 text-sm font-medium">{o.users?.full_name || '—'}</td>
                          <td className="px-5 py-4 text-sm font-bold">{formatCurrency(o.total_amount)}</td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={cn('text-xs capitalize', STATUS_COLOR[o.status] || '')}>{o.status?.replace('_', ' ')}</Badge>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              {o.status !== 'delivered' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-500 border-emerald-500/30"
                                  onClick={() => updateOrderStatus(o.id, 'delivered')}>
                                  <CheckCircle className="h-3 w-3" /> Deliver
                                </Button>
                              )}
                              {o.status === 'pending' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-blue-400 border-blue-500/30"
                                  onClick={() => updateOrderStatus(o.id, 'confirmed')}>
                                  <Truck className="h-3 w-3" /> Confirm
                                </Button>
                              )}
                              {o.status !== 'cancelled' && o.status !== 'delivered' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-400 border-red-500/30"
                                  onClick={() => updateOrderStatus(o.id, 'cancelled')}>
                                  <XCircle className="h-3 w-3" /> Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESERVATIONS ── */}
        {tab === 'reservations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Reservation Management</h2>
              <span className="text-sm text-muted-foreground">{reservations.length} reservations</span>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">Loading reservations…</div>
              ) : reservations.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No reservations found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border/50">
                      <tr>{['Code', 'Guest', 'Date', 'Time', 'Party', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4 text-sm font-mono font-bold text-amber-500">{r.confirmation_code}</td>
                          <td className="px-5 py-4 text-sm font-medium">{r.users?.full_name || '—'}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{r.date}</td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">{r.time}</td>
                          <td className="px-5 py-4 text-sm">{r.guest_count} guests</td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={cn('text-xs capitalize',
                              r.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              r.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            )}>{r.status}</Badge>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              {r.status === 'pending' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-500 border-emerald-500/30"
                                  onClick={() => updateReservationStatus(r.id, 'confirmed')}>
                                  <CheckCircle className="h-3 w-3" /> Confirm
                                </Button>
                              )}
                              {r.status !== 'cancelled' && r.status !== 'completed' && (
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-400 border-red-500/30"
                                  onClick={() => updateReservationStatus(r.id, 'cancelled')}>
                                  <XCircle className="h-3 w-3" /> Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
