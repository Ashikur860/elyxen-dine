import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  target,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      setCount(Math.floor(easedProgress * target * Math.pow(10, decimals)) / Math.pow(10, decimals))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
