// User types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'manager' | 'employee'
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// Meeting types
export interface Meeting {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  location: string
  address: string
  latitude?: number
  longitude?: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  priority: 'standard' | 'vip'
  isRecurring: boolean
  recurringPattern?: string
  createdAt: string
  updatedAt: string
}

export interface CreateMeetingData {
  title: string
  description: string
  clientId: string
  employeeId: string
  startDate: string
  endDate: string
  location: string
  address: string
  priority: 'standard' | 'vip'
  isRecurring: boolean
  recurringPattern?: string
}

// Client types
export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  position?: string
  address: string
  latitude?: number
  longitude?: number
  priority: 'standard' | 'vip'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateClientData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  position?: string
  address: string
  priority: 'standard' | 'vip'
}

// Task types
export interface Task {
  id: string
  title: string
  description: string
  clientId: string
  clientName: string
  employeeId: string
  employeeName: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskData {
  title: string
  description: string
  clientId: string
  employeeId: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate: string
}

// Statistics types
export interface Statistics {
  totalMeetings: number
  completedMeetings: number
  postponedMeetings: number
  cancelledMeetings: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  totalClients: number
  vipClients: number
  standardClients: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter types
export interface MeetingFilters {
  status?: string
  priority?: string
  employeeId?: string
  clientId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface TaskFilters {
  status?: string
  priority?: string
  employeeId?: string
  clientId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface ClientFilters {
  priority?: string
  status?: string
  search?: string
}
