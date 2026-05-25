import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthUser {
  id:         string
  email:      string
  artistName: string | null
  planTier:   string
  mustChangePassword: boolean
}

interface AuthContextValue {
  user:    AuthUser | null
  session: Session | null
  loading: boolean
  signIn:  (email: string, password: string) => Promise<{ error: string | null; mustChangePassword?: boolean }>
  signUp:  (email: string, password: string, artistName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadProfile(userId: string): Promise<{ artistName: string | null; planTier: string }> {
  const { data } = await supabase
    .from('artist_preferences')
    .select('artist_name, plan_tier')
    .eq('user_id', userId)
    .maybeSingle()
  return {
    artistName: data?.artist_name ?? null,
    planTier:   data?.plan_tier   ?? 'free',
  }
}

function buildUser(supaUser: User, profile: { artistName: string | null; planTier: string }): AuthUser {
  return {
    id:         supaUser.id,
    email:      supaUser.email ?? '',
    artistName: profile.artistName,
    planTier:   profile.planTier,
    mustChangePassword: supaUser.user_metadata?.must_change_password === true,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  async function hydrateUser(s: Session | null) {
    if (!s?.user) { setUser(null); setSession(null); return }
    setSession(s)
    const profile = await loadProfile(s.user.id)
    setUser(buildUser(s.user, profile))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      hydrateUser(s).finally(() => setLoading(false))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      hydrateUser(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {
      error: null,
      mustChangePassword: data.user?.user_metadata?.must_change_password === true,
    }
  }

  async function signUp(email: string, password: string, artistName: string) {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { artist_name: artistName } },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  async function refreshUser() {
    const { data: { session: s } } = await supabase.auth.getSession()
    await hydrateUser(s)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
