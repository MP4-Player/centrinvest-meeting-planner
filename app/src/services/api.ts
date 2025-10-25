import { AuthResponse, LoginCredentials, RegisterData } from '@/types'

// Mock API Service for development
class ApiService {
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check for admin user
    if (credentials.email === 'admin@example.com' && credentials.password === 'Admin1') {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
      
      return {
        token: 'mock-admin-token-' + Date.now(),
        user: adminUser
      }
    }
    
    // Check for existing users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
    const user = existingUsers.find((u: any) => 
      u.email === credentials.email && u.password === credentials.password
    )
    
    if (!user) {
      throw new Error('Неверные учетные данные')
    }
    
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]')
    const existingUser = existingUsers.find((u: any) => u.email === data.email)
    
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует')
    }
    
    // Create new user
    const newUser = {
      id: 'user-' + Date.now(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'user'
    }
    
    existingUsers.push(newUser)
    localStorage.setItem('mockUsers', JSON.stringify(existingUsers))
    
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    }
  }

  async logout(): Promise<void> {
    // Mock logout - no server call needed
  }

  // Generic CRUD methods (mock implementations)
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    // Mock data based on endpoint
    if (endpoint.includes('/meetings')) {
      return this.getMockMeetings(params) as T
    } else if (endpoint.includes('/clients')) {
      return this.getMockClients(params) as T
    } else if (endpoint.includes('/tasks')) {
      return this.getMockTasks(params) as T
    } else if (endpoint.includes('/map/locations')) {
      return this.getMockMapLocations() as T
    } else if (endpoint.includes('/statistics')) {
      return this.getMockStatistics() as T
    }
    
    throw new Error('Endpoint not implemented')
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    if (endpoint.includes('/meetings')) {
      return this.createMockMeeting(data) as T
    } else if (endpoint.includes('/clients')) {
      return this.createMockClient(data) as T
    } else if (endpoint.includes('/tasks')) {
      return this.createMockTask(data) as T
    }
    
    throw new Error('Endpoint not implemented')
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Mock update - return the data as if it was updated
    return data as T
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Mock delete - return success
    return { success: true } as T
  }

  // Route optimization endpoint
  async optimizeRoute(meetingIds: string[], startLocation?: {
    latitude: number
    longitude: number
    address: string
  }): Promise<any> {
    await this.delay(1500) // Simulate API call

    // Mock route optimization logic
    // In real implementation, this would call a backend service that uses
    // a routing algorithm (e.g., Google Maps API, OSRM, etc.)

    const meetings = meetingIds.map(id => {
      // Find meeting from mock data
      const mockMeetings = this.getMockMeetings({})
      const meeting = mockMeetings.data.find((m: any) => m.id === id)
      return meeting
    }).filter(Boolean)

    // Simple optimization: sort by location (in reality would use proper routing)
    const optimizedSchedule = meetings.map((meeting: any, index: number) => ({
      id: `schedule-${meeting.id}`,
      meetingId: meeting.id,
      meeting,
      order: index + 1,
      estimatedTravelTime: Math.floor(Math.random() * 30) + 10, // Mock: 10-40 min
      distance: Math.floor(Math.random() * 10000) + 1000, // Mock: 1-11 km
    }))

    const totalDistance = optimizedSchedule.reduce((sum: number, item: any) =>
      sum + (item.distance || 0), 0
    )
    const totalTravelTime = optimizedSchedule.reduce((sum: number, item: any) =>
      sum + (item.estimatedTravelTime || 0), 0
    )

    // Calculate total duration including meeting times
    const totalDuration = totalTravelTime + meetings.reduce((sum: number, meeting: any) => {
      const start = new Date(meeting.startDate).getTime()
      const end = new Date(meeting.endDate).getTime()
      return sum + (end - start) / (1000 * 60) // Convert to minutes
    }, 0)

    return {
      optimizedSchedule,
      totalDistance,
      totalTravelTime,
      totalDuration,
    }
  }

  // Get map locations for schedule
  async getScheduleMapLocations(scheduleItems: any[]): Promise<any> {
    await this.delay(500)

    // Mock: Return locations for map visualization
    return scheduleItems.map((item, index) => ({
      id: item.id,
      order: item.order,
      latitude: item.meeting.latitude || 55.7558 + (Math.random() - 0.5) * 0.1,
      longitude: item.meeting.longitude || 37.6176 + (Math.random() - 0.5) * 0.1,
      address: item.meeting.address,
      title: item.meeting.title,
      type: 'meeting',
    }))
  }

  // Mock data generators
  private getMockMeetings(params?: any) {
    const meetings = [
      {
        id: '1',
        title: 'Встреча с клиентом А',
        description: 'Обсуждение проекта',
        clientId: '1',
        clientName: 'ООО Ромашка',
        employeeId: '1',
        employeeName: 'Иван Иванов',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(),
        location: 'Офис клиента',
        address: 'ул. Ленина, 1',
        latitude: 55.7558,
        longitude: 37.6176,
        status: 'scheduled',
        priority: 'vip',
        isRecurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    return {
      data: meetings,
      total: meetings.length,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  }

  private getMockClients(params?: any) {
    const clients = [
      {
        id: '1',
        firstName: 'Иван',
        lastName: 'Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        company: 'ООО Ромашка',
        position: 'Директор',
        address: 'ул. Ленина, 1, Москва',
        latitude: 55.7558,
        longitude: 37.6176,
        priority: 'vip',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    return {
      data: clients,
      total: clients.length,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  }

  private getMockTasks(params?: any) {
    const tasks = [
      {
        id: '1',
        title: 'Подготовить презентацию',
        description: 'Создать презентацию для клиента',
        clientId: '1',
        clientName: 'ООО Ромашка',
        employeeId: '1',
        employeeName: 'Иван Иванов',
        status: 'pending',
        priority: 'high',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    return {
      data: tasks,
      total: tasks.length,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  }

  private getMockMapLocations() {
    return [
      {
        id: '1',
        name: 'Встреча с клиентом',
        type: 'meeting',
        latitude: 55.7558,
        longitude: 37.6176,
        address: 'ул. Ленина, 1',
        description: 'Обсуждение проекта',
        status: 'scheduled',
        priority: 'vip'
      }
    ]
  }

  private getMockStatistics() {
    return {
      totalMeetings: 156,
      completedMeetings: 142,
      postponedMeetings: 8,
      cancelledMeetings: 6,
      totalTasks: 89,
      completedTasks: 67,
      pendingTasks: 22,
      totalClients: 45,
      vipClients: 12,
      standardClients: 33
    }
  }

  private createMockMeeting(data: any) {
    return {
      id: 'meeting-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private createMockClient(data: any) {
    return {
      id: 'client-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private createMockTask(data: any) {
    return {
      id: 'task-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

export const apiService = new ApiService()
