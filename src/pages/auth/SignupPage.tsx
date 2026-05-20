import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const { signUp, signInWithGoogle, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // Auto-redirect if already logged in (e.g. no email confirmation required)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setAuthError(null)
    const result = await signUp(data.email, data.password, data.fullName)
    if (result.error) {
      setAuthError(result.error)
    } else if (result.needsConfirmation) {
      setNeedsConfirmation(true)
    }
    // If no error and no confirmation needed, useEffect will redirect automatically
  }

  const handleGoogle = async () => {
    setAuthError(null)
    const { error } = await signInWithGoogle()
    if (error) setAuthError(error)
  }

  // Email confirmation screen
  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
          <div className="h-20 w-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <MailCheck className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We sent a confirmation link to your email address. Click it to activate your account, then come back to sign in.
          </p>
          <div className="bg-card border border-border/50 rounded-2xl p-5 mb-6 text-sm text-muted-foreground">
            <p>Didn't get it? Check your spam folder. The email comes from <span className="text-foreground font-medium">noreply@supabase.io</span></p>
          </div>
          <Link to="/auth/login">
            <Button className="w-full gap-2">Go to Sign In <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-gold-glow">
              <span className="text-black font-bold text-sm">E</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-xl leading-none block">ElyXen</span>
              <span className="text-amber-500 text-sm font-medium leading-none">Dine</span>
            </div>
          </Link>
          <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm">Join ElyXen Dine — the finest dining platform</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">

          {/* Error / success banners */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 mb-5 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="button" variant="outline" className="w-full gap-3 mb-5 h-11" onClick={handleGoogle}>
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or register with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full name</label>
              <Input placeholder="John Doe" icon={<User className="h-4 w-4" />} error={errors.fullName?.message} autoComplete="name" {...register('fullName')} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email address</label>
              <Input type="email" placeholder="you@example.com" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} autoComplete="email" {...register('email')} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password <span className="text-muted-foreground font-normal">(min. 6 characters)</span></label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                icon={<Lock className="h-4 w-4" />}
                iconRight={
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                autoComplete="new-password"
                {...register('password')}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              By creating an account you agree to our{' '}
              <Link to="#" className="text-amber-500 hover:underline">Terms</Link> and{' '}
              <Link to="#" className="text-amber-500 hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full gap-2" size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
              Create Account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
