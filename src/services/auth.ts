import { supabase } from './supabase'
import type { Profile } from './supabase'

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

export interface SignUpData {
  email: string
  password: string
  full_name: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  // Sign up with email and password
  static async signUp({ email, password, full_name }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    })

    if (error) throw error
    return data
  }

  // Sign in with email and password
  static async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  // Update password
  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    })
    if (error) throw error
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  // Get user profile
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create user profile (called after signup)
  static async createProfile(userId: string, profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profile
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Upload profile photo
  static async uploadProfilePhoto(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/profile.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update profile with photo URL
    await this.updateProfile(userId, { photo_url: data.publicUrl })

    return data.publicUrl
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}