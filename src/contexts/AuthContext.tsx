import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService, type AuthUser } from '../services/auth'
import type { Profile } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  uploadProfilePhoto: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await AuthService.getCurrentSession()
        if (session?.user) {
          setUser(session.user as AuthUser)
          // Try to get profile, but don't fail if it doesn't exist yet
          try {
            const userProfile = await AuthService.getProfile(session.user.id)
            setProfile(userProfile)
          } catch (profileError) {
            console.warn('Profile not found, will be created on first access:', profileError)
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (session?.user) {
          setUser(session.user as AuthUser)
          // Try to get profile, but don't fail if it doesn't exist yet
          try {
            const userProfile = await AuthService.getProfile(session.user.id)
            setProfile(userProfile)
          } catch (profileError) {
            console.warn('Profile not found for authenticated user:', profileError)
            // Create profile if it doesn't exist
            try {
              const newProfile = await AuthService.createProfile(session.user.id, {
                full_name: session.user.user_metadata?.full_name || 'New User',
                email: session.user.email || '',
                designation: '',
                photo_url: undefined
              })
              setProfile(newProfile)
            } catch (createError) {
              console.error('Error creating profile:', createError)
              setProfile(null)
            }
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { user: authUser } = await AuthService.signIn({ email, password })
      setUser(authUser as AuthUser)
      const userProfile = await AuthService.getProfile(authUser.id)
      setProfile(userProfile)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      const { user: authUser } = await AuthService.signUp({ email, password, full_name: fullName })
      if (authUser) {
        setUser(authUser as AuthUser)
        // Profile will be created automatically via trigger
        const userProfile = await AuthService.getProfile(authUser.id)
        setProfile(userProfile)
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')
    const updatedProfile = await AuthService.updateProfile(user.id, updates)
    setProfile(updatedProfile)
  }

  const uploadProfilePhoto = async (file: File) => {
    if (!user) throw new Error('No user logged in')
    const photoUrl = await AuthService.uploadProfilePhoto(user.id, file)
    setProfile(prev => prev ? { ...prev, photo_url: photoUrl } : null)
    return photoUrl
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    uploadProfilePhoto
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}