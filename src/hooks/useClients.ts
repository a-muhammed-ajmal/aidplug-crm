import { useState, useEffect } from 'react'
import { ClientsService } from '../services/clients'
import type { Client } from '../services/supabase'

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ClientsService.getClients()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newClient = await ClientsService.createClient(clientData)
    setClients(prev => [newClient, ...prev])
    return newClient
  }

  const updateClient = async (id: string, updates: Partial<Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const updatedClient = await ClientsService.updateClient(id, updates)
    setClients(prev => prev.map(client => client.id === id ? updatedClient : client))
    return updatedClient
  }

  const deleteClient = async (id: string) => {
    await ClientsService.deleteClient(id)
    setClients(prev => prev.filter(client => client.id !== id))
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}