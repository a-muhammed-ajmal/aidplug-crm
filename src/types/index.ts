// Re-export all types from services
export type {
  Lead,
  Client,
  Deal,
  Task,
  Profile,
  SalesCycle
} from '../services/supabase'

// Additional UI types
export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

export interface FilterOptions {
  urgency: string
  salaryRange: [number, number]
  products: string[]
}

export interface TaskFilter {
  key: 'today' | 'urgent' | 'overdue' | 'all'
  label: string
}

export interface LeadStatus {
  key: 'all' | 'warm' | 'qualified' | 'appointment_booked'
  label: string
}

export interface DealStage {
  id: string
  title: string
  color: string
}

export interface Product {
  id: number
  name: string
  key: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  total_clients: number
  total_value: number
  growth: number
}

export interface Referral {
  id: string
  name: string
  type: string
}

// Form types
export interface LeadFormData {
  fullName: string
  email: string
  company: string
  location: string
  mobile: string
  salary: string
  bank: string
  productType: string
  product: string
  referral: string
}

export interface ClientFormData {
  fullName: string
  photo: File | null
  mobile: string
  email: string
  dob: string
  nationality: string
  visaStatus: string
  emiratesId: string
  passport: string
  aecbScore: string
  emirate: string
  companyName: string
  designation: string
  salary: string
  companyLandline: string
  companyWebsite: string
  officialEmail: string
}

export interface DealFormData {
  title: string
  client_name: string
  amount: string
  application_number: string
  bdi_number: string
}

export interface TaskFormData {
  title: string
  description: string
  due_date: string
  priority: string
  type: string
  estimated_duration: number
}

export interface UserFormData {
  fullName: string
  designation: string
  email: string
  photo: File | null
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

// Dashboard KPI types
export interface DashboardKPIs {
  activeDeals: { value: number }
  daysRemaining: { value: number }
  doneSuccessfully: { value: number }
}

// Settings types
export interface UserPreferences {
  pushNotifications: boolean
  emailNotifications: boolean
  mobileSync: boolean
}

export interface SalesCycleSettings {
  startDate: string
  endDate: string
}