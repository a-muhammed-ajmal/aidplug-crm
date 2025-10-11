import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useTasks } from '../hooks/useTasks';

const MainApp: React.FC = () => {
  const { signOut } = useAuth();
  const { leads, loading: leadsLoading } = useLeads();
  const { clients, loading: clientsLoading } = useClients();
  const { deals, loading: dealsLoading } = useDeals();
  const { tasks, loading: tasksLoading } = useTasks();

  const activeDeals = deals.filter(d => !['completed', 'unsuccessful'].includes(d.stage)).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

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
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  loading: boolean;
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

export default MainApp;