import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const contactSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll get back to you within 24 hours. ✉️')
    reset()
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border/50 py-16 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">Get In Touch</p>
            <h1 className="font-display text-4xl font-bold mb-3">We'd love to hear from you</h1>
            <p className="text-muted-foreground">Have a question, suggestion, or want to partner with us? We're here.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14">
        <div className="grid lg:grid-cols-[380px_1fr] gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our team is always ready to assist you. Reach out through any of the channels below and we'll respond promptly.
              </p>
            </div>

            {[
              { icon: Mail, label: 'Email Us', value: 'hello@elyxendine.com', href: 'mailto:hello@elyxendine.com' },
              { icon: Phone, label: 'Call Us', value: '+1 (800) ELYXEN-1', href: 'tel:+18003593361' },
              { icon: MapPin, label: 'Visit Us', value: '123 Culinary Ave, New York, NY 10001', href: '#' },
              { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9am–6pm EST', href: '#' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-amber-500/30 transition-all group"
              >
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium text-sm group-hover:text-amber-500 transition-colors">{value}</p>
                </div>
              </a>
            ))}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-amber-500" />
                <p className="font-semibold text-sm">Live Chat Available</p>
              </div>
              <p className="text-xs text-muted-foreground">Chat with our support team in real-time during business hours.</p>
              <Button size="sm" className="mt-3">Start Live Chat</Button>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border/50 rounded-2xl p-8 shadow-lg"
          >
            <h2 className="font-display text-2xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <Input placeholder="How can we help?" error={errors.subject?.message} {...register('subject')} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <textarea
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                  {...register('message')}
                />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full gap-2" size="lg" isLoading={isSubmitting}>
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
