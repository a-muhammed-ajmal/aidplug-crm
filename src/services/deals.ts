import { supabase } from './supabase'
import type { Deal } from './supabase'

export class DealsService {
  // Get all deals for the current user
  static async getDeals(): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get a single deal by ID
  static async getDeal(id: string): Promise<Deal | null> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create a new deal
  static async createDeal(deal: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Deal> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('deals')
      .insert({
        ...deal,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a deal
  static async updateDeal(id: string, updates: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Deal> {
    const { data, error } = await supabase
      .from('deals')
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

  // Delete a deal
  static async deleteDeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Get deals by stage
  static async getDealsByStage(stage: string): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('stage', stage)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Search deals
  static async searchDeals(query: string): Promise<Deal[]> {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .or(`title.ilike.%${query}%,client_name.ilike.%${query}%,application_number.ilike.%${query}%,bdi_number.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get deals count
  static async getDealsCount(): Promise<number> {
    const { count, error } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }

  // Get deals by stage for Kanban
  static async getDealsForKanban(): Promise<Record<string, Deal[]>> {
    const deals = await this.getDeals()

    const stages = [
      'application_processing',
      'verification_needed',
      'activation_needed',
      'completed',
      'unsuccessful'
    ]

    const dealsByStage: Record<string, Deal[]> = {}
    stages.forEach(stage => {
      dealsByStage[stage] = deals.filter(deal => deal.stage === stage)
    })

    return dealsByStage
  }

  // Move deal to different stage
  static async moveDeal(dealId: string, newStage: string): Promise<Deal> {
    const updates: Partial<Deal> = { stage: newStage }

    if (newStage === 'completed') {
      updates.completed_date = new Date().toISOString().split('T')[0]
    } else if (['completed', 'unsuccessful'].includes(newStage)) {
      updates.completed_date = undefined
    }

    return this.updateDeal(dealId, updates)
  }

  // Get deals statistics
  static async getDealsStats(): Promise<{
    total: number
    active: number
    completed: number
    unsuccessful: number
    totalValue: number
    completedValue: number
  }> {
    const deals = await this.getDeals()

    const stats = {
      total: deals.length,
      active: deals.filter(d => !['completed', 'unsuccessful'].includes(d.stage)).length,
      completed: deals.filter(d => d.stage === 'completed').length,
      unsuccessful: deals.filter(d => d.stage === 'unsuccessful').length,
      totalValue: deals.reduce((sum, d) => sum + (d.amount || 0), 0),
      completedValue: deals
        .filter(d => d.stage === 'completed')
        .reduce((sum, d) => sum + (d.amount || 0), 0)
    }

    return stats
  }

  // Convert deal to client
  static async convertToClient(dealId: string): Promise<void> {
    const deal = await this.getDeal(dealId)
    if (!deal) throw new Error('Deal not found')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Create client from deal
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        full_name: deal.client_name,
        relationship_status: 'active',
        total_loan_amount: deal.amount,
        products: [deal.product_type],
        client_since: new Date().toISOString().split('T')[0]
      })

    if (clientError) throw clientError

    // Mark deal as completed
    await this.moveDeal(dealId, 'completed')
  }
}