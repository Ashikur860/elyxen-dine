import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const { error } = await resetPassword(data.email)
    if (error) {
      toast.error(error)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-gold-glow">
              <span className="text-black font-bold">E</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-xl leading-none block">ElyXen</span>
              <span className="text-amber-500 text-sm font-medium leading-none">Dine</span>
            </div>
          </Link>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
          {sent ? (
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-foreground">{getValues('email')}</span>
              </p>
              <Link to="/auth/login">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold mb-1">Reset password</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email address</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  Send Reset Link
                </Button>
              </form>
              <Link to="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
