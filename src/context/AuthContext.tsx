import React, { createContext, useContext, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  profileLoaded: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function buildUser(
  id: string,
  email: string | undefined,
  metadata: Record<string, string> | undefined,
  created_at: string | undefined,
  dbRow?: Record<string, unknown> | null,
  appMeta?: Record<string, string> | undefined
): User {
  return {
    id,
    email: (dbRow?.email as string) || email || '',
    full_name: (dbRow?.full_name as string) || metadata?.full_name || (email?.split('@')[0] ?? 'User'),
    avatar_url: (dbRow?.avatar_url as string | null) ?? metadata?.avatar_url ?? null,
    phone: (dbRow?.phone as string | null) ?? null,
    role: ((dbRow?.role as string) || appMeta?.role || 'customer') as User['role'],
    created_at: (dbRow?.created_at as string) || created_at || new Date().toISOString(),
  }
}

function friendlyError(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox.'
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) return 'Incorrect email or password. Please try again.'
  if (msg.includes('email logins are disabled')) return 'Email login is disabled. Please contact support.'
  if (msg.includes('too many requests')) return 'Too many attempts. Please wait a few minutes.'
  if (msg.includes('already registered') || msg.includes('user already exists')) return 'An account with this email already exists. Please sign in.'
  if (msg.includes('password should be')) return 'Password must be at least 6 characters.'
  return message
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, profileLoaded, isAuthenticated, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // Hard fallback — never stuck more than 4s
    const fallback = setTimeout(() => setLoading(false), 4000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clearTimeout(fallback)
        logout()
        return
      }

      if (session?.user) {
        const { id, email, user_metadata, app_metadata, created_at } = session.user
        clearTimeout(fallback)
        setLoading(true)

        try {
          const { data } = await Promise.race([
            supabase.from('users').select('*').eq('id', id).maybeSingle(),
            new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000)),
          ])
          setUser(buildUser(id, email, user_metadata as Record<string, string>, created_at, data as Record<string, unknown> | null, app_metadata as Record<string, string>), true)
        } catch {
          setUser(buildUser(id, email, user_metadata as Record<string, string>, created_at, null, app_metadata as Record<string, string>), true)
        }
      } else {
        clearTimeout(fallback)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallback)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? friendlyError(error.message) : null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: friendlyError(error.message) }
    if (data.session) return { error: null }
    return { error: null, needsConfirmation: true }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    return { error: error?.message || null }
  }

  const signOut = async () => {
    logout()
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error: error?.message || null }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, profileLoaded, isAuthenticated, signIn, signUp, signInWithGoogle, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
