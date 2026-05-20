import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  count?: number
  className?: string
}

export function StarRating({ rating, max = 5, size = 'sm', showValue, count, className }: StarRatingProps) {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' }
  const iconSize = sizeMap[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = i < Math.floor(rating)
          const partial = !filled && i < rating
          return (
            <Star
              key={i}
              className={cn(
                iconSize,
                filled ? 'fill-amber-400 text-amber-400' : partial ? 'fill-amber-400/50 text-amber-400' : 'fill-muted text-muted-foreground/30'
              )}
            />
          )
        })}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
