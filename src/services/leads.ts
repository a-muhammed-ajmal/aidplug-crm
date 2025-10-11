import { supabase } from './supabase'
import type { Lead } from './supabase'

export class LeadsService {
  // Get all leads for the current user
  static async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get a single lead by ID
  static async getLead(id: string): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create a new lead
  static async createLead(lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...lead,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a lead
  static async updateLead(id: string, updates: Partial<Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
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

  // Delete a lead
  static async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Convert lead to deal
  static async convertToDeal(leadId: string, dealData: {
    title: string
    amount?: number
    client_name: string
    expected_close_date?: string
    product_type?: string
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create the deal
    const { error: dealError } = await supabase
      .from('deals')
      .insert({
        ...dealData,
        user_id: user.id,
        stage: 'application_processing',
        probability: 25
      })

    if (dealError) throw dealError

    // Delete the lead
    const { error: leadError } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)

    if (leadError) throw leadError
  }

  // Get leads by status
  static async getLeadsByStatus(status: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('qualification_status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Search leads
  static async searchLeads(query: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get leads count
  static async getLeadsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }
}