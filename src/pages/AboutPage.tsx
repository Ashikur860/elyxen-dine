import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Heart, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'

const VALUES = [
  { icon: Award, title: 'Excellence', desc: 'We partner only with restaurants that meet our rigorous quality standards.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Heart, title: 'Community', desc: 'Building meaningful connections between diners and local culinary artisans.', color: 'text-red-400', bg: 'bg-red-500/10' },
  { icon: Shield, title: 'Reliability', desc: 'Dependable service you can count on, from order to delivery, every time.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Zap, title: 'Innovation', desc: 'Continuously evolving our platform to deliver the best dining experience.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
]

const TEAM = [
  { name: 'Elena Voss', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { name: 'David Kim', role: 'CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { name: 'Priya Mehta', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { name: 'Carlos Ruiz', role: 'VP Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
]

export function AboutPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative py-24 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-muted/50 to-background text-center">
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-3">Our Story</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Redefining the art of<br />
              <span className="gradient-text">dining together</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              ElyXen Dine was founded with a single vision: to make premium restaurant experiences accessible to everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 2019, label: 'Founded', suffix: '' },
              { value: 500, label: 'Restaurant Partners', suffix: '+' },
              { value: 2, label: 'Million Users', suffix: 'M+' },
              { value: 48, label: 'Cities Served', suffix: '' },
            ].map(({ value, label, suffix }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="font-display text-4xl font-bold text-amber-500 mb-1">
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">What Drives Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/50 bg-card hover:border-amber-500/20 transition-all text-center">
                <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 md:px-6 bg-muted/30 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">The People</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Meet the team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img }, i) => (
              <motion.div key={name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <img src={img} alt={name} className="h-24 w-24 rounded-2xl object-cover mx-auto mb-3 ring-2 ring-border" />
                <p className="font-display font-bold">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to elevate your dining?</h2>
          <p className="text-muted-foreground mb-8">Join millions of food lovers who've discovered extraordinary dining through ElyXen Dine.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="xl" asChild className="gap-2">
              <Link to="/restaurants">Explore Restaurants <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
