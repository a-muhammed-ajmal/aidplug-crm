import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Lead {
  id: string
  user_id: string
  full_name: string
  email?: string
  phone?: string
  company_name?: string
  monthly_salary?: number
  loan_amount_requested?: number
  product_interest?: string[]
  qualification_status: string
  last_contact_date?: string
  urgency_level: string
  location?: string
  employment_years?: number
  existing_loans?: number
  referral_source?: string
  bank_name?: string
  product_type?: string
  product?: string
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  full_name: string
  photo_url?: string
  email?: string
  phone?: string
  company_name?: string
  designation?: string
  monthly_salary?: number
  relationship_status: string
  total_loan_amount?: number
  products?: string[]
  last_interaction?: string
  client_since?: string
  dob?: string
  nationality?: string
  visa_status?: string
  emirates_id?: string
  passport?: string
  aecb_score?: number
  emirate?: string
  company_landline?: string
  company_website?: string
  official_email?: string
  ltv_ratio?: number
  payment_history?: string
  risk_category?: string
  created_at: string
  updated_at: string
}

export interface Deal {
  id: string
  user_id: string
  client_id?: string
  title: string
  amount?: number
  stage: string
  client_name: string
  expected_close_date?: string
  probability?: number
  product_type?: string
  interest_rate?: number
  tenure?: number
  application_number?: string
  bdi_number?: string
  completed_date?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  client_id?: string
  title: string
  description?: string
  type: string
  priority: string
  due_date: string
  time?: string
  status: string
  estimated_duration?: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  designation?: string
  email: string
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface SalesCycle {
  id: string
  user_id: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}