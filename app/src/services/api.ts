import { AuthResponse, LoginCredentials, RegisterData, Meeting, CreateMeetingData, Client, CreateClientData, Task, CreateTaskData, Statistics, RouteOptimizationRequest, RouteOptimizationResponse } from '@/types'
import { MockStorageService } from './mockStorage'

// API configuration - using mock storage instead of backend
const USE_MOCK = true // Set to false when backend is ready

class ApiService {
  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockStorageService.login(credentials)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK) {
      return MockStorageService.register(data)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async logout(): Promise<void> {
    if (USE_MOCK) {
      return MockStorageService.logout()
    }
    // Backend implementation here when ready
  }

  // Meetings methods
  async getMeetings(filters?: any, page = 1, limit = 10): Promise<{ data: Meeting[] }> {
    if (USE_MOCK) {
      const meetings = await MockStorageService.getMeetings(filters)
      return { data: meetings }
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async getMeeting(id: string): Promise<Meeting> {
    if (USE_MOCK) {
      return MockStorageService.getMeeting(id)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async createMeeting(meeting: CreateMeetingData): Promise<Meeting> {
    if (USE_MOCK) {
      return MockStorageService.createMeeting(meeting)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async updateMeeting(id: string, meeting: CreateMeetingData): Promise<Meeting> {
    if (USE_MOCK) {
      return MockStorageService.updateMeeting(id, meeting)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async deleteMeeting(id: string): Promise<void> {
    if (USE_MOCK) {
      return MockStorageService.deleteMeeting(id)
    }
    // Backend implementation here when ready
  }

  // Clients methods
  async getClients(filters?: any, page = 1, limit = 10): Promise<{ data: Client[] }> {
    if (USE_MOCK) {
      const clients = await MockStorageService.getClients(filters)
      return { data: clients }
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async getClient(id: string): Promise<Client> {
    if (USE_MOCK) {
      return MockStorageService.getClient(id)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async createClient(client: CreateClientData): Promise<Client> {
    if (USE_MOCK) {
      return MockStorageService.createClient(client)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async updateClient(id: string, client: CreateClientData): Promise<Client> {
    if (USE_MOCK) {
      return MockStorageService.updateClient(id, client)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async deleteClient(id: string): Promise<void> {
    if (USE_MOCK) {
      return MockStorageService.deleteClient(id)
    }
    // Backend implementation here when ready
  }

  // Tasks methods
  async getTasks(filters?: any, page = 1, limit = 10): Promise<{ data: Task[] }> {
    if (USE_MOCK) {
      const tasks = await MockStorageService.getTasks(filters)
      return { data: tasks }
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async getTask(id: string): Promise<Task> {
    if (USE_MOCK) {
      return MockStorageService.getTask(id)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async createTask(task: CreateTaskData): Promise<Task> {
    if (USE_MOCK) {
      return MockStorageService.createTask(task)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async updateTask(id: string, task: CreateTaskData): Promise<Task> {
    if (USE_MOCK) {
      return MockStorageService.updateTask(id, task)
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async deleteTask(id: string): Promise<void> {
    if (USE_MOCK) {
      return MockStorageService.deleteTask(id)
    }
    // Backend implementation here when ready
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    if (USE_MOCK) {
      return MockStorageService.getStatistics()
    }
    // Backend implementation here when ready
    throw new Error('Backend not implemented')
  }

  async getMeetingTypes(): Promise<any[]> {
    // Mock meeting types
    return [
      { id: 'work_meeting', label: 'Рабочие совещания', color: '#3B82F6' },
      { id: 'partner_meeting', label: 'Встречи с партнерами', color: '#10B981' },
      { id: 'client_meeting', label: 'Встречи с клиентами', color: '#F59E0B' },
      { id: 'briefing', label: 'Брифинг', color: '#8B5CF6' },
      { id: 'product_presentation', label: 'Презентация продукта', color: '#EC4899' },
      { id: 'business_lunch', label: 'Бизнес ланч', color: '#14B8A6' },
      { id: 'other', label: 'Иное', color: '#6B7280' }
    ]
  }

  async createMeetingType(meetingType: any): Promise<any> {
    // Mock implementation
    return { ...meetingType, id: `custom-${Date.now()}` }
  }

  // Route optimization
  async optimizeRoute(request: RouteOptimizationRequest): Promise<RouteOptimizationResponse> {
    // Mock implementation - just return the same order with some mock data
    const meetings = await MockStorageService.getMeetings()
    const requestedMeetings = meetings.filter(m => request.meetingIds.includes(m.id))

    return {
      optimizedSchedule: requestedMeetings.map((meeting, index) => ({
        id: `schedule-${index}`,
        meetingId: meeting.id,
        meeting: meeting as any,
        order: index + 1,
        estimatedTravelTime: index > 0 ? 15 : 0,
        distance: index > 0 ? 5000 : 0
      })),
      totalDistance: requestedMeetings.length > 1 ? (requestedMeetings.length - 1) * 5000 : 0,
      totalTravelTime: requestedMeetings.length > 1 ? (requestedMeetings.length - 1) * 15 : 0,
      totalDuration: requestedMeetings.reduce((sum, m) => {
        const start = new Date(m.startDate).getTime()
        const end = new Date(m.endDate).getTime()
        return sum + (end - start) / (1000 * 60)
      }, 0)
    }
  }

  // Get map locations for schedule
  async getScheduleMapLocations(scheduleItems: any[]): Promise<any> {
    // This would typically call a backend endpoint, but for now we'll process locally
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
}

export const apiService = new ApiService()