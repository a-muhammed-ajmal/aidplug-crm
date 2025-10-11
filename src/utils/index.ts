import { format, parseISO, isToday, isPast, differenceInDays } from 'date-fns'

// Date utilities
export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd MMM yyyy')
  } catch {
    return dateString
  }
}

export const formatDateShort = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd/MM/yy')
  } catch {
    return dateString
  }
}

export const isDateToday = (dateString: string): boolean => {
  try {
    return isToday(parseISO(dateString))
  } catch {
    return false
  }
}

export const isDateOverdue = (dateString: string): boolean => {
  try {
    return isPast(parseISO(dateString)) && !isToday(parseISO(dateString))
  } catch {
    return false
  }
}

export const getDaysUntil = (dateString: string): number => {
  try {
    const date = parseISO(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return differenceInDays(date, today)
  } catch {
    return 0
  }
}

// Number formatting utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPercentage = (num: number): string => {
  return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
}

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str
}

// Array utilities
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait) as number
  }
}

// Local storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage errors
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore storage errors
    }
  }
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+971\s?\d{2}\s?\d{3}\s?\d{4}$/
  return phoneRegex.test(phone)
}

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Sleep utility for testing
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Error handling
export const handleError = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Constants
export const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah'
]

export const UAE_BANK_NAMES = [
  'Emirates Islamic Bank',
  'Emirates NBD',
  'Abu Dhabi Commercial Bank (ADCB)',
  'Dubai Islamic Bank (DIB)',
  'First Abu Dhabi Bank (FAB)',
  'RAKBANK',
  'Mashreq Bank',
  'Commercial Bank of Dubai (CBD)',
  'Abu Dhabi Islamic Bank (ADIB)',
  'Standard Chartered UAE',
  'HSBC Middle East',
  'National Bank of Fujairah (NBF)',
  'Ajman Bank'
]

export const PRODUCT_TYPES = [
  'Credit Card',
  'Personal Loan',
  'Home Loan',
  'Auto Loan',
  'Account Opening'
]

export const TASK_TYPES = [
  'call',
  'meeting',
  'documentation',
  'verification',
  'follow_up'
]

export const TASK_PRIORITIES = [
  'low',
  'medium',
  'high',
  'urgent'
]

export const DEAL_STAGES = [
  'application_processing',
  'verification_needed',
  'activation_needed',
  'completed',
  'unsuccessful'
]