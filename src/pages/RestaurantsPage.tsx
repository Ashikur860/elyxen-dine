import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { RestaurantCard } from '@/components/cards/RestaurantCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MOCK_RESTAURANTS, CUISINE_TYPES, SORT_OPTIONS } from '@/constants'
import { cn } from '@/lib/utils'

export function RestaurantsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [cuisine, setCuisine] = useState('All')
  const [sort, setSort] = useState('rating')
  const [showOpen, setShowOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<string[]>([])

  const filtered = useMemo(() => {
    let results = [...MOCK_RESTAURANTS]

    if (search) {
      results = results.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine_type.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (cuisine !== 'All') {
      results = results.filter((r) => r.cuisine_type === cuisine)
    }

    if (showOpen) {
      results = results.filter((r) => r.is_open)
    }

    if (priceRange.length > 0) {
      results = results.filter((r) => priceRange.includes(r.price_range))
    }

    results.sort((a, b) => {
      switch (sort) {
        case 'rating': return b.rating - a.rating
        case 'delivery_time': return parseInt(a.delivery_time) - parseInt(b.delivery_time)
        case 'delivery_fee': return a.delivery_fee - b.delivery_fee
        default: return 0
      }
    })

    return results
  }, [search, cuisine, sort, showOpen, priceRange])

  const togglePriceRange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setCuisine('All')
    setSort('rating')
    setShowOpen(false)
    setPriceRange([])
  }

  const hasActiveFilters = cuisine !== 'All' || showOpen || priceRange.length > 0

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50 py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-1">Explore</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">All Restaurants</h1>

            {/* Search */}
            <div className="flex gap-3 max-w-2xl">
              <div className="flex-1 flex items-center gap-2 border border-border bg-background rounded-2xl px-4 py-3 focus-within:border-amber-500/50 transition-colors">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="outline" className="gap-2 rounded-2xl">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Cuisine */}
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger className="w-[150px] rounded-xl">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {CUISINE_TYPES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[170px] rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Open now */}
          <button
            onClick={() => setShowOpen(!showOpen)}
            className={cn(
              'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
              showOpen ? 'bg-amber-500 text-black border-amber-500' : 'border-border hover:border-amber-500/30'
            )}
          >
            Open Now
          </button>

          {/* Price range */}
          {['$', '$$', '$$$', '$$$$'].map((p) => (
            <button
              key={p}
              onClick={() => togglePriceRange(p)}
              className={cn(
                'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                priceRange.includes(p) ? 'bg-amber-500 text-black border-amber-500' : 'border-border hover:border-amber-500/30'
              )}
            >
              {p}
            </button>
          ))}

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}

          <div className="ml-auto">
            <Badge variant="outline" className="text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'restaurant' : 'restaurants'}
            </Badge>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-display text-xl font-bold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
            <Button onClick={clearFilters} variant="outline">Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((restaurant, i) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
