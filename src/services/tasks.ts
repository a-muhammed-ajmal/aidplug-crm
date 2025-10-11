import { supabase } from './supabase'
import type { Task } from './supabase'

export class TasksService {
  // Get all tasks for the current user
  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get a single task by ID
  static async getTask(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Create a new task
  static async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update a task
  static async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
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

  // Delete a task
  static async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Toggle task completion
  static async toggleTaskCompletion(id: string): Promise<Task> {
    const task = await this.getTask(id)
    if (!task) throw new Error('Task not found')

    return this.updateTask(id, {
      status: task.status === 'completed' ? 'pending' : 'completed'
    })
  }

  // Get tasks by status
  static async getTasksByStatus(status: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get tasks by priority
  static async getTasksByPriority(priority: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get tasks by type
  static async getTasksByType(type: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get today's tasks
  static async getTodayTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('due_date', today)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get overdue tasks
  static async getOverdueTasks(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .lt('due_date', today)
      .neq('status', 'completed')
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Get upcoming tasks (next 7 days)
  static async getUpcomingTasks(): Promise<Task[]> {
    const today = new Date()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(today.getDate() + 7)

    const startDate = today.toISOString().split('T')[0]
    const endDate = sevenDaysFromNow.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Search tasks
  static async searchTasks(query: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get tasks count
  static async getTasksCount(): Promise<number> {
    const { count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  }

  // Get pending tasks count
  static async getPendingTasksCount(): Promise<number> {
    const { count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (error) throw error
    return count || 0
  }

  // Get tasks statistics
  static async getTasksStats(): Promise<{
    total: number
    pending: number
    completed: number
    overdue: number
    today: number
  }> {
    const [total, pending, completed, overdue, today] = await Promise.all([
      this.getTasksCount(),
      this.getPendingTasksCount(),
      this.getTasksByStatus('completed').then(tasks => tasks.length),
      this.getOverdueTasks().then(tasks => tasks.length),
      this.getTodayTasks().then(tasks => tasks.length)
    ])

    return {
      total,
      pending,
      completed,
      overdue,
      today
    }
  }
}