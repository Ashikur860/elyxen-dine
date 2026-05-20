import { motion } from 'framer-motion'
import { Clock, MapPin, Star, Truck, ChevronRight, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
  index?: number
  variant?: 'default' | 'featured' | 'compact'
}

export function RestaurantCard({ restaurant, index = 0, variant = 'default' }: RestaurantCardProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link to={`/restaurants/${restaurant.id}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-accent transition-colors group">
          <img src={restaurant.image_url} alt={restaurant.name} className="h-16 w-16 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{restaurant.name}</p>
            <p className="text-xs text-muted-foreground">{restaurant.cuisine_type}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{restaurant.rating}</span>
              <span className="text-xs text-muted-foreground">· {restaurant.delivery_time}</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors flex-shrink-0" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/restaurants/${restaurant.id}`}
        className={cn(
          'group block rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-amber-500/30 hover:shadow-card-hover transition-all duration-300',
          variant === 'featured' && 'ring-1 ring-amber-500/20'
        )}
      >
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            {restaurant.is_featured && (
              <Badge className="bg-amber-500 text-black text-xs font-semibold">
                <Flame className="h-3 w-3 mr-1" /> Featured
              </Badge>
            )}
            {!restaurant.is_open && (
              <Badge variant="danger">Closed</Badge>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-white text-xs font-semibold">{restaurant.rating}</span>
                <span className="text-white/60 text-xs">({restaurant.review_count.toLocaleString()})</span>
              </div>
              <Badge variant="outline" className="bg-black/60 backdrop-blur-sm border-white/20 text-white text-xs">
                {restaurant.price_range}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-base leading-tight group-hover:text-amber-500 transition-colors">
              {restaurant.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{restaurant.delivery_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5" />
              <span>{restaurant.delivery_fee === 0 ? 'Free delivery' : `$${restaurant.delivery_fee} delivery`}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{restaurant.city}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
