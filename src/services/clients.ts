import { supabase } from './supabase'
import type { Client } from './supabase'

export class ClientsService {
  // Get all clients for the current user
  static async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get a single client by ID
  static async getClient(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create a new client
  static async createClient(client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a client
  static async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete a client
  static async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Search clients
  static async searchClients(query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get clients by relationship status
  static async getClientsByStatus(status: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('relationship_status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get clients count
  static async getClientsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }

  // Upload client photo
  static async uploadClientPhoto(clientId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `clients/${clientId}/photo.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update client with photo URL
    await this.updateClient(clientId, { photo_url: data.publicUrl })

    return data.publicUrl
  }

  // Get upcoming birthdays
  static async getUpcomingBirthdays(): Promise<Client[]> {
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .not('dob', 'is', null)
      .order('dob')

    if (error) throw error

    // Filter clients with birthdays in the next 7 days
    return (data || []).filter(client => {
      if (!client.dob) return false
      const birthDate = new Date(client.dob)
      birthDate.setFullYear(today.getFullYear())
      return birthDate >= today && birthDate <= sevenDaysFromNow
    })
  }

  // Get upcoming anniversaries
  static async getUpcomingAnniversaries(): Promise<Client[]> {
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .not('client_since', 'is', null)
      .order('client_since')

    if (error) throw error

    // Filter clients with anniversaries in the next 7 days
    return (data || []).filter(client => {
      if (!client.client_since) return false
      const anniversaryDate = new Date(client.client_since)
      const years = today.getFullYear() - anniversaryDate.getFullYear()
      if (years <= 0) return false

      anniversaryDate.setFullYear(today.getFullYear())
      return anniversaryDate >= today && anniversaryDate <= sevenDaysFromNow
    })
  }
}