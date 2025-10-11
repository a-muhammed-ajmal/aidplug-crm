import { useState, useEffect } from 'react'
import { TasksService } from '../services/tasks'
import type { Task } from '../services/supabase'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TasksService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newTask = await TasksService.createTask(taskData)
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const updatedTask = await TasksService.updateTask(id, updates)
    setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    return updatedTask
  }

  const deleteTask = async (id: string) => {
    await TasksService.deleteTask(id)
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleTaskCompletion = async (id: string) => {
    const updatedTask = await TasksService.toggleTaskCompletion(id)
    setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
    return updatedTask
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  }
}