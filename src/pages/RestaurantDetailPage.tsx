import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Clock, Star, Phone, ChevronLeft, Heart,
  Share2, Truck, CheckCircle2, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FoodCard } from '@/components/cards/FoodCard'
import { StarRating } from '@/components/shared/StarRating'
import { MOCK_RESTAURANTS, MOCK_FOODS, FOOD_CATEGORIES } from '@/constants'
import { formatCurrency, cn } from '@/lib/utils'

export function RestaurantDetailPage() {
  const { id } = useParams()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id) || MOCK_RESTAURANTS[0]
  const foods = MOCK_FOODS.filter((f) => f.restaurant_id === id || id === '1')

  const filteredFoods = selectedCategory === 'all'
    ? foods
    : foods.filter((f) => f.category_id === selectedCategory)

  const categories = ['all', ...Array.from(new Set(foods.map((f) => f.category_id)))]

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.cover_url || restaurant.image_url}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link to="/restaurants">
            <Button variant="glass" size="sm" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="glass" size="icon" className="h-9 w-9">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="icon" className="h-9 w-9">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" className="text-base px-6 py-2">Currently Closed</Badge>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
                {restaurant.is_featured && (
                  <Badge variant="premium">Featured</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3 max-w-xl">{restaurant.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{restaurant.rating}</span>
                  <span>({restaurant.review_count.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {restaurant.delivery_time}
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  {restaurant.delivery_fee === 0 ? 'Free delivery' : formatCurrency(restaurant.delivery_fee)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {restaurant.address}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                restaurant.is_open
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              )}>
                <div className={cn('h-2 w-2 rounded-full', restaurant.is_open ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                {restaurant.is_open ? 'Open Now' : 'Closed'}
              </div>
              <Badge variant="outline">{restaurant.price_range} · {restaurant.cuisine_type}</Badge>
              <Button size="sm" variant="outline" className="gap-1.5 mt-1">
                <Phone className="h-3.5 w-3.5" /> {restaurant.phone}
              </Button>
            </div>
          </div>

          {/* Min order info */}
          {restaurant.minimum_order > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2.5">
              <Info className="h-4 w-4 text-amber-500 flex-shrink-0" />
              Minimum order: {formatCurrency(restaurant.minimum_order)} · Free delivery on orders over $50
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {restaurant.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-lg">{tag}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Menu Tabs */}
        <div className="mb-6">
          <h2 className="font-display text-xl font-bold mb-4">Menu</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => {
              const catInfo = FOOD_CATEGORIES.find((c) => c.id === cat)
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all',
                    selectedCategory === cat
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'border-border hover:border-amber-500/30'
                  )}
                >
                  {catInfo?.emoji && <span>{catInfo.emoji}</span>}
                  {catInfo?.name || cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="font-semibold">No items in this category</p>
            <p className="text-muted-foreground text-sm mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
            {filteredFoods.map((food, i) => (
              <FoodCard key={food.id} food={food} index={i} />
            ))}
          </div>
        )}

        {/* Reviews Placeholder */}
        <div className="border-t border-border pt-10 pb-12">
          <h2 className="font-display text-xl font-bold mb-6">Customer Reviews</h2>
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-amber-500 mb-1">{restaurant.rating}</div>
              <StarRating rating={restaurant.rating} size="md" className="justify-center mb-1" />
              <p className="text-sm text-muted-foreground">{restaurant.review_count.toLocaleString()} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-4 text-right">{stars}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {stars === 5 ? '70%' : stars === 4 ? '20%' : '5%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-500" /> Write a Review
          </Button>
        </div>
      </div>
    </div>
  )
}
