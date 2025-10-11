import { useState, useEffect } from 'react'
import { DealsService } from '../services/deals'
import type { Deal } from '../services/supabase'

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DealsService.getDeals()
      setDeals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deals')
    } finally {
      setLoading(false)
    }
  }

  const createDeal = async (dealData: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newDeal = await DealsService.createDeal(dealData)
    setDeals(prev => [newDeal, ...prev])
    return newDeal
  }

  const updateDeal = async (id: string, updates: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const updatedDeal = await DealsService.updateDeal(id, updates)
    setDeals(prev => prev.map(deal => deal.id === id ? updatedDeal : deal))
    return updatedDeal
  }

  const deleteDeal = async (id: string) => {
    await DealsService.deleteDeal(id)
    setDeals(prev => prev.filter(deal => deal.id !== id))
  }

  const moveDeal = async (dealId: string, newStage: string) => {
    const updatedDeal = await DealsService.moveDeal(dealId, newStage)
    setDeals(prev => prev.map(deal => deal.id === dealId ? updatedDeal : deal))
    return updatedDeal
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    moveDeal
  }
}