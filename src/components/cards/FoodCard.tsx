import { motion } from 'framer-motion'
import { Plus, Heart, Flame, Leaf, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/shared/StarRating'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import type { Food } from '@/types'

interface FoodCardProps {
  food: Food
  index?: number
}

export function FoodCard({ food, index = 0 }: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(food)
    toast.success(`${food.name} added to cart`, {
      description: formatCurrency(food.price),
      icon: '🛒',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-amber-500/30 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={food.image_url}
          alt={food.name}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {food.is_featured && (
            <Badge className="bg-amber-500 text-black text-xs">Popular</Badge>
          )}
          {food.is_vegetarian && (
            <Badge className="bg-emerald-500 text-white text-xs">
              <Leaf className="h-3 w-3 mr-0.5" /> Veg
            </Badge>
          )}
          {food.is_spicy && (
            <Badge className="bg-red-500 text-white text-xs">
              <Flame className="h-3 w-3 mr-0.5" /> Spicy
            </Badge>
          )}
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-red-400 hover:bg-black/60 transition-all"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-sm leading-tight mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">
          {food.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2 leading-relaxed">
          {food.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={food.rating} showValue count={food.review_count} />
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {food.preparation_time}m
          </div>
          {food.calories && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{food.calories} cal</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">{formatCurrency(food.price)}</span>
          </div>
          <Button
            size="icon"
            onClick={handleAddToCart}
            disabled={!food.is_available}
            className="h-9 w-9 rounded-xl shadow-gold-glow"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {!food.is_available && (
          <p className="text-xs text-red-400 mt-2 text-center">Currently unavailable</p>
        )}
      </div>
    </motion.div>
  )
}
