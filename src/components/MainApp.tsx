import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { useClients } from '../hooks/useClients';
import { useDeals } from '../hooks/useDeals';
import { useTasks } from '../hooks/useTasks';
import type { Task, Client } from '../types';

// Component prop interfaces
interface DashboardKPICardProps {
  title: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface QuickActionButtonProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  colorClass: string;
  onClick: () => void;
}

interface ThingsToDoProps {
  tasks: Task[];
  onSeeMore: () => void;
}

interface UpcomingEventsProps {
  clients: Client[];
}

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  leadsCount: number;
  clientsCount: number;
  dealsCount: number;
  pendingTasksCount: number;
}

interface MobileNavListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  leadsCount: number;
  clientsCount: number;
  dealsCount: number;
  pendingTasksCount: number;
}
import {
  Briefcase,
  Clock,
  CheckCircle,
  Zap,
  Plus,
  Users,
  User,
  PieChart,
  List,
  Settings,
  Home,
  Menu,
  Building,
  X,
  Award,
  Calendar,
  Activity,
  Gift,
  Star
} from 'lucide-react';

const MainApp: React.FC = () => {
  // const { signOut } = useAuth();
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();
  const { tasks } = useTasks();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate KPI values
  const activeDeals = deals.filter(d => !['completed', 'unsuccessful'].includes(d.stage)).length;
  const doneSuccessfully = deals.filter(d => d.stage === 'completed').length;
  const daysRemaining = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate();

  const kpis = {
    activeDeals: { value: activeDeals },
    daysRemaining: { value: daysRemaining },
    doneSuccessfully: { value: doneSuccessfully }
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <DashboardKPICard
          title="Deals Processing"
          value={kpis.activeDeals.value}
          color="bg-red-500"
          icon={Briefcase}
        />
        <DashboardKPICard
          title="Days Remaining"
          value={kpis.daysRemaining.value}
          color="bg-orange-500"
          icon={Clock}
        />
        <DashboardKPICard
          title="Done Successfully"
          value={kpis.doneSuccessfully.value}
          color="bg-green-500"
          icon={CheckCircle}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton
            onClick={() => setActiveTab('leads')}
            icon={<Plus className="w-5 h-5 text-white" />}
            title="New Lead"
            subtitle="Onboard new prospect"
            colorClass="bg-blue-500"
          />
          <QuickActionButton
            onClick={() => setActiveTab('clients')}
            icon={<User className="w-5 h-5 text-white" />}
            title="New Client"
            subtitle="Add client profile"
            colorClass="bg-green-500"
          />
          <QuickActionButton
            onClick={() => setActiveTab('deals')}
            icon={<Briefcase className="w-5 h-5 text-white" />}
            title="New Deal"
            subtitle="Create deal pipeline"
            colorClass="bg-purple-500"
          />
          <QuickActionButton
            onClick={() => setActiveTab('tasks')}
            icon={<List className="w-5 h-5 text-white" />}
            title="New Task"
            subtitle="Schedule follow-up"
            colorClass="bg-orange-500"
          />
        </div>
      </div>

      {/* Things to Get Done & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThingsToDo tasks={pendingTasks} onSeeMore={() => setActiveTab('tasks')} />
        <UpcomingEvents clients={clients} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-600" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New lead added</p>
              <p className="text-xs text-gray-600">Ahmed Al Rashid - Hot lead</p>
            </div>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Deal stage updated</p>
              <p className="text-xs text-gray-600">Personal loan moved to documentation</p>
            </div>
            <span className="text-xs text-gray-500">4h ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Task completed</p>
              <p className="text-xs text-gray-600">Client meeting with Mohammed</p>
            </div>
            <span className="text-xs text-gray-500">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Leads Management</h2>
      <p className="text-gray-600">Manage your leads and prospects here.</p>
      <p className="text-sm text-gray-500 mt-2">Total leads: {leads.length}</p>
    </div>
  );

  const renderClients = () => (
    <div className="text-center py-12">
      <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Management</h2>
      <p className="text-gray-600">Manage your client relationships here.</p>
      <p className="text-sm text-gray-500 mt-2">Total clients: {clients.length}</p>
    </div>
  );

  const renderDeals = () => (
    <div className="text-center py-12">
      <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Pipeline</h2>
      <p className="text-gray-600">Track and manage your deals here.</p>
      <p className="text-sm text-gray-500 mt-2">Active deals: {activeDeals}</p>
    </div>
  );

  const renderTasks = () => (
    <div className="text-center py-12">
      <List className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h2>
      <p className="text-gray-600">Organize and track your tasks here.</p>
      <p className="text-sm text-gray-500 mt-2">Pending tasks: {pendingTasks.length}</p>
    </div>
  );

  const renderProducts = () => (
    <div className="text-center py-12">
      <PieChart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h2>
      <p className="text-gray-600">Manage your products and services here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="text-center py-12">
      <Settings className="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
      <p className="text-gray-600">Configure your CRM settings here.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        leadsCount={leads.length}
        clientsCount={clients.length}
        dealsCount={activeDeals}
        pendingTasksCount={pendingTasks.length}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b lg:hidden">
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">AidPlug CRM</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'leads' && renderLeads()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'deals' && renderDeals()}
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

// Component definitions
const DashboardKPICard: React.FC<DashboardKPICardProps> = ({ title, value, color, icon }) => (
  <div className="rounded-lg shadow-sm overflow-hidden bg-white flex flex-col">
    <div className={`${color} text-white p-3 relative h-20 flex items-center justify-center`}>
      <div className="absolute -right-1 -bottom-1 opacity-20 text-white">
        {React.createElement(icon, { size: 56 })}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="p-3 flex-grow flex items-center justify-center">
      <p className="text-sm text-gray-700 font-medium leading-tight text-center">{title}</p>
    </div>
  </div>
);

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, title, subtitle, colorClass, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-95 text-left w-full"
  >
    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </button>
);

const ThingsToDo: React.FC<ThingsToDoProps> = ({ tasks, onSeeMore }) => {
  const displayedTasks = tasks.slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Users className="w-4 h-4" />;
      case 'meeting': return <User className="w-4 h-4" />;
      case 'email': return <List className="w-4 h-4" />;
      default: return <List className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <List className="w-5 h-5 mr-2 text-purple-600" />
          Things to Get Done
        </h3>
        {tasks.length > 5 && (
          <button onClick={onSeeMore} className="text-sm font-medium text-blue-600 hover:underline">
            See all
          </button>
        )}
      </div>

      {displayedTasks.length > 0 ? (
        <div className="space-y-3">
          {displayedTasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {getTypeIcon(task.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                </p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <List className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No pending tasks.</p>
        </div>
      )}
    </div>
  );
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ clients }) => {
  const events: { id: string; type: string; date: Date; clientName: string; years: number | null }[] = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  clients.forEach(client => {
    if (client.dob) {
      const birthDate = new Date(client.dob);
      birthDate.setFullYear(today.getFullYear());
      if (birthDate >= today && birthDate <= sevenDaysFromNow) {
        events.push({
          id: `b-${client.id}`,
          type: 'Birthday',
          date: birthDate,
          clientName: client.full_name,
          years: null,
        });
      }
    }
    if (client.client_since) {
      const anniversaryDate = new Date(client.client_since);
      const years = today.getFullYear() - anniversaryDate.getFullYear();
      anniversaryDate.setFullYear(today.getFullYear());
      if (anniversaryDate >= today && anniversaryDate <= sevenDaysFromNow && years > 0) {
        events.push({
          id: `a-${client.id}`,
          type: 'Anniversary',
          date: anniversaryDate,
          clientName: client.full_name,
          years: years
        });
      }
    }
  });

  const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Award className="w-5 h-5 mr-2 text-orange-600" />
        Upcoming Events
      </h3>
      {sortedEvents.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents.map(event => (
            <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                event.type === 'Birthday' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {event.type === 'Birthday' ? <Gift className="w-4 h-4" /> : <Star className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{event.clientName}</p>
                <p className="text-xs text-gray-500">
                  {event.type === 'Anniversary' ? `${event.years} Year Anniversary` : 'Birthday'}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No upcoming events.</p>
        </div>
      )}
    </div>
  );
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange, isOpen, onClose, leadsCount, clientsCount, dealsCount, pendingTasksCount }) => (
  <>
    {/* Mobile Sidebar Overlay */}
    {isOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AidPlug CRM</h2>
                <p className="text-sm text-blue-100">Banking Solutions</p>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-white hover:bg-opacity-20 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <MobileNavList
            activeTab={activeTab}
            onTabChange={onTabChange}
            onClose={onClose}
            leadsCount={leadsCount}
            clientsCount={clientsCount}
            dealsCount={dealsCount}
            pendingTasksCount={pendingTasksCount}
           />
        </div>
      </div>
    )}

    {/* Bottom Navigation for Mobile */}
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        {[
          { key: 'dashboard', icon: Home, label: 'Home' },
          { key: 'leads', icon: Users, label: 'Leads' },
          { key: 'clients', icon: User, label: 'Clients' },
          { key: 'deals', icon: Briefcase, label: 'Deals' },
          { key: 'tasks', icon: List, label: 'Tasks' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-col items-center justify-end h-14 py-2 px-1 text-xs transition-all ${
              activeTab === tab.key
                ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="font-medium leading-none">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  </>
);

const MobileNavList: React.FC<MobileNavListProps> = ({ activeTab, onTabChange, onClose, leadsCount, clientsCount, dealsCount, pendingTasksCount }) => {
  const navItems = [
    { key: 'dashboard', icon: Home, label: 'Dashboard', count: null, color: 'text-blue-600' },
    { key: 'leads', icon: Users, label: 'Leads', count: leadsCount, color: 'text-green-600' },
    { key: 'clients', icon: User, label: 'Clients', count: clientsCount, color: 'text-purple-600' },
    { key: 'products', icon: PieChart, label: 'Products', count: 0, color: 'text-teal-600' },
    { key: 'deals', icon: Briefcase, label: 'Deals', count: dealsCount, color: 'text-orange-600' },
    { key: 'tasks', icon: List, label: 'Tasks', count: pendingTasksCount, color: 'text-red-600' },
    { key: 'settings', icon: Settings, label: 'Settings', count: null, color: 'text-gray-600' },
  ];

  return (
    <div className="p-2 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Main Menu</h3>
        {navItems.slice(0, 6).map((item) => (
          <button
            key={item.key}
            onClick={() => { onTabChange(item.key); onClose(); }}
            className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all ${
              activeTab === item.key
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${activeTab === item.key ? 'text-blue-600' : item.color}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.count !== null && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                activeTab === item.key
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Tools</h3>
        {navItems.slice(6).map((item) => (
          <button
            key={item.key}
            onClick={() => { onTabChange(item.key); onClose(); }}
            className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 text-left transition-all ${
              activeTab === item.key
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${activeTab === item.key ? 'text-blue-600' : item.color}`} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.count !== null && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                activeTab === item.key
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainApp;