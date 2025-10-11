import { useState, useEffect } from 'react'
import { LeadsService } from '../services/leads'
import type { Lead } from '../services/supabase'

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await LeadsService.getLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newLead = await LeadsService.createLead(leadData)
    setLeads(prev => [newLead, ...prev])
    return newLead
  }

  const updateLead = async (id: string, updates: Partial<Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const updatedLead = await LeadsService.updateLead(id, updates)
    setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead))
    return updatedLead
  }

  const deleteLead = async (id: string) => {
    await LeadsService.deleteLead(id)
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const convertToDeal = async (leadId: string, dealData: {
    title: string
    amount?: number
    client_name: string
    expected_close_date?: string
    product_type?: string
  }) => {
    await LeadsService.convertToDeal(leadId, dealData)
    // Remove the lead from the list
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    convertToDeal
  }
}