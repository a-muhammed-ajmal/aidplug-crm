import React, { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/shared/AuthModal'
import { useLeads } from './hooks/useLeads'
import { useClients } from './hooks/useClients'
import { useDeals } from './hooks/useDeals'
import { useTasks } from './hooks/useTasks'

function App() {
  const { user, loading, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { leads, loading: leadsLoading } = useLeads()
  const { clients, loading: clientsLoading } = useClients()
  const { deals, loading: dealsLoading } = useDeals()
  const { tasks, loading: tasksLoading } = useTasks()

  const activeDeals = deals.filter(d => !['completed', 'unsuccessful'].includes(d.stage)).length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AidPlug CRM</h1>
            <p className="text-gray-600">Banking Solutions Platform</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome Back</h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your CRM dashboard and manage your banking relationships.
            </p>

            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </div>
    )
  }

  // Basic CRM Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">AidPlug CRM</h1>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Leads" value={leads.length.toString()} loading={leadsLoading} />
          <DashboardCard title="Clients" value={clients.length.toString()} loading={clientsLoading} />
          <DashboardCard title="Active Deals" value={activeDeals.toString()} loading={dealsLoading} />
          <DashboardCard title="Pending Tasks" value={pendingTasks.toString()} loading={tasksLoading} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome to Your CRM Dashboard</h2>
          <p className="text-gray-600">
            Your CRM application is now connected to Supabase. The data integration is in progress.
            You can now create, read, update, and delete leads, clients, deals, and tasks.
          </p>
        </div>
      </main>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  loading: boolean
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {loading ? (
        <div className="animate-pulse h-8 bg-gray-200 rounded mt-2"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      )}
    </div>
  );
};

export default App
