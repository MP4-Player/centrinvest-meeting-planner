import {
  AuthUser,
  Meeting,
  Client,
  Task,
  CreateMeetingData,
  CreateClientData,
  CreateTaskData,
  Statistics,
  AuthResponse,
  LoginCredentials,
  RegisterData
} from '@/types'

// Storage keys
const STORAGE_KEYS = {
  USERS: 'mock_users',
  MEETINGS: 'mock_meetings',
  CLIENTS: 'mock_clients',
  TASKS: 'mock_tasks',
  CURRENT_USER: 'mock_current_user',
  AUTH_TOKEN: 'authToken'
}

// Helper function to generate ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Initialize default data
const initializeDefaultData = () => {
  // Default admin user
  const defaultUsers = [
    {
      id: 'admin-1',
      email: 'admin@example.com',
      password: 'admin', // 5 characters
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ]

  // Default clients
  const defaultClients: Client[] = [
    {
      id: 'client-1',
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      company: 'ООО Компания',
      position: 'Директор',
      address: 'Москва, ул. Тверская, д. 1',
      latitude: 55.7558,
      longitude: 37.6176,
      priority: 'vip',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'client-2',
      firstName: 'Петр',
      lastName: 'Петров',
      email: 'petr@example.com',
      phone: '+7 (999) 234-56-78',
      company: 'ИП Петров',
      address: 'Москва, Арбат, д. 10',
      latitude: 55.7522,
      longitude: 37.5933,
      priority: 'standard',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(defaultClients))
  }

  // Default meetings for testing - only create if not exists
  if (!localStorage.getItem(STORAGE_KEYS.MEETINGS)) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

  const todayAt10 = new Date(today)
  todayAt10.setHours(10, 0, 0, 0)

  const todayAt11 = new Date(today)
  todayAt11.setHours(11, 0, 0, 0)

  const todayAt13 = new Date(today)
  todayAt13.setHours(13, 0, 0, 0)

  const todayAt14 = new Date(today)
  todayAt14.setHours(14, 0, 0, 0)

  const todayAt15 = new Date(today)
  todayAt15.setHours(15, 0, 0, 0)

  const tomorrowAt10 = new Date(tomorrow)
  tomorrowAt10.setHours(10, 0, 0, 0)

  const tomorrowAt11 = new Date(tomorrow)
  tomorrowAt11.setHours(11, 0, 0, 0)

  const tomorrowAt15 = new Date(tomorrow)
  tomorrowAt15.setHours(15, 0, 0, 0)

  const tomorrowAt16 = new Date(tomorrow)
  tomorrowAt16.setHours(16, 0, 0, 0)

  const defaultMeetings = [
    {
      id: 'meeting-1',
      title: 'Презентация продукта',
      description: 'Презентация нового продукта для клиента',
      clientId: 'client-1',
      clientName: 'Иван Иванов',
      employeeId: 'admin-1',
      employeeName: 'Admin User',
      startDate: todayAt10.toISOString(),
      endDate: todayAt11.toISOString(),
      location: 'Офис Компании',
      address: 'Москва, ул. Тверская, д. 1',
      latitude: 55.7558,
      longitude: 37.6176,
      status: 'scheduled',
      priority: 'vip',
      isRecurring: false,
      meetingType: 'product_presentation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'meeting-2',
      title: 'Встреча с партнером',
      description: 'Обсуждение условий партнерства',
      clientId: 'client-2',
      clientName: 'Петр Петров',
      employeeId: 'admin-1',
      employeeName: 'Admin User',
      startDate: todayAt14.toISOString(),
      endDate: todayAt15.toISOString(),
      location: 'Кафе Арбат',
      address: 'Москва, Арбат, д. 10',
      latitude: 55.7522,
      longitude: 37.5933,
      status: 'scheduled',
      priority: 'standard',
      isRecurring: false,
      meetingType: 'partner_meeting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'meeting-3',
      title: 'Бизнес ланч',
      description: 'Неформальное обсуждение проекта',
      clientId: 'client-1',
      clientName: 'Иван Иванов',
      employeeId: 'admin-1',
      employeeName: 'Admin User',
      startDate: todayAt13.toISOString(),
      endDate: todayAt14.toISOString(),
      location: 'Ресторан Прага',
      address: 'Москва, Арбат, д. 2',
      latitude: 55.7525,
      longitude: 37.5935,
      status: 'scheduled',
      priority: 'vip',
      isRecurring: false,
      meetingType: 'business_lunch',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'meeting-4',
      title: 'Знакомство с клиентом',
      description: 'Первая встреча с потенциальным клиентом',
      clientId: 'client-2',
      clientName: 'Петр Петров',
      employeeId: 'admin-1',
      employeeName: 'Admin User',
      startDate: tomorrowAt10.toISOString(),
      endDate: tomorrowAt11.toISOString(),
      location: 'Офис',
      address: 'Москва, ул. Тверская, д. 5',
      latitude: 55.7560,
      longitude: 37.6180,
      status: 'scheduled',
      priority: 'standard',
      isRecurring: false,
      meetingType: 'work_meeting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'meeting-5',
      title: 'Подписание договора',
      description: 'Финальное подписание контракта',
      clientId: 'client-1',
      clientName: 'Иван Иванов',
      employeeId: 'admin-1',
      employeeName: 'Admin User',
      startDate: tomorrowAt15.toISOString(),
      endDate: tomorrowAt16.toISOString(),
      location: 'Офис Компании',
      address: 'Москва, ул. Тверская, д. 1',
      latitude: 55.7558,
      longitude: 37.6176,
      status: 'scheduled',
      priority: 'vip',
      isRecurring: false,
      meetingType: 'briefing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

    // Save default meetings only on first initialization
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(defaultMeetings))
  }

  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]))
  }
}

// Initialize on load
initializeDefaultData()

// Mock Storage Service
export class MockStorageService {
  // Auth methods
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    )

    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }

    const token = `mock-token-${generateId()}`

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(authUser))

    return {
      token,
      user: authUser
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')

    // Check if email already exists
    if (users.some((u: any) => u.email === data.email)) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const newUser = {
      id: generateId(),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'employee',
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    }

    const token = `mock-token-${generateId()}`

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(authUser))

    return {
      token,
      user: authUser
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  // Meetings methods
  static async getMeetings(filters?: any): Promise<Meeting[]> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    return meetings
  }

  static async getMeeting(id: string): Promise<Meeting> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const meeting = meetings.find((m: Meeting) => m.id === id)

    if (!meeting) {
      throw new Error('Встреча не найдена')
    }

    return meeting
  }

  static async createMeeting(data: CreateMeetingData): Promise<Meeting> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}')

    const client = clients.find((c: Client) => c.id === data.clientId)

    const newMeeting: any = {
      id: generateId(),
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Неизвестный клиент',
      employeeId: currentUser.id || data.employeeId,
      employeeName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Неизвестный сотрудник',
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      address: data.address,
      latitude: client?.latitude,
      longitude: client?.longitude,
      status: 'scheduled',
      priority: data.priority,
      isRecurring: data.isRecurring,
      recurringPattern: data.recurringPattern,
      meetingType: data.meetingType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    meetings.push(newMeeting)
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings))

    // Schedule notification
    this.scheduleMeetingNotification(newMeeting)

    return newMeeting
  }

  static async updateMeeting(id: string, data: CreateMeetingData): Promise<Meeting> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')

    const index = meetings.findIndex((m: Meeting) => m.id === id)

    if (index === -1) {
      throw new Error('Встреча не найдена')
    }

    const client = clients.find((c: Client) => c.id === data.clientId)

    const updatedMeeting: any = {
      ...meetings[index],
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : meetings[index].clientName,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      address: data.address,
      latitude: client?.latitude,
      longitude: client?.longitude,
      priority: data.priority,
      isRecurring: data.isRecurring,
      recurringPattern: data.recurringPattern,
      meetingType: data.meetingType,
      updatedAt: new Date().toISOString()
    }

    meetings[index] = updatedMeeting
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings))

    // Reschedule notification
    this.scheduleMeetingNotification(updatedMeeting)

    return updatedMeeting
  }

  static async deleteMeeting(id: string): Promise<void> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const filtered = meetings.filter((m: Meeting) => m.id !== id)
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(filtered))
  }

  // Clients methods
  static async getClients(filters?: any): Promise<Client[]> {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')
    return clients
  }

  static async getClient(id: string): Promise<Client> {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')
    const client = clients.find((c: Client) => c.id === id)

    if (!client) {
      throw new Error('Клиент не найден')
    }

    return client
  }

  static async createClient(data: CreateClientData): Promise<Client> {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')

    const newClient: Client = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      position: data.position,
      address: data.address,
      priority: data.priority,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    clients.push(newClient)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients))

    return newClient
  }

  static async updateClient(id: string, data: CreateClientData): Promise<Client> {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')

    const index = clients.findIndex((c: Client) => c.id === id)

    if (index === -1) {
      throw new Error('Клиент не найден')
    }

    const updatedClient: Client = {
      ...clients[index],
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      position: data.position,
      address: data.address,
      priority: data.priority,
      updatedAt: new Date().toISOString()
    }

    clients[index] = updatedClient
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients))

    return updatedClient
  }

  static async deleteClient(id: string): Promise<void> {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')
    const filtered = clients.filter((c: Client) => c.id !== id)
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered))
  }

  // Tasks methods
  static async getTasks(filters?: any): Promise<Task[]> {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    return tasks
  }

  static async getTask(id: string): Promise<Task> {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    const task = tasks.find((t: Task) => t.id === id)

    if (!task) {
      throw new Error('Задача не найдена')
    }

    return task
  }

  static async createTask(data: CreateTaskData): Promise<Task> {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || '{}')

    const client = clients.find((c: Client) => c.id === data.clientId)

    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Неизвестный клиент',
      employeeId: currentUser.id || data.employeeId,
      employeeName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Неизвестный сотрудник',
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tasks.push(newTask)
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))

    return newTask
  }

  static async updateTask(id: string, data: CreateTaskData): Promise<Task> {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')

    const index = tasks.findIndex((t: Task) => t.id === id)

    if (index === -1) {
      throw new Error('Задача не найдена')
    }

    const client = clients.find((c: Client) => c.id === data.clientId)

    const updatedTask: Task = {
      ...tasks[index],
      title: data.title,
      description: data.description,
      clientId: data.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : tasks[index].clientName,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      updatedAt: new Date().toISOString()
    }

    tasks[index] = updatedTask
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))

    return updatedTask
  }

  static async deleteTask(id: string): Promise<void> {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    const filtered = tasks.filter((t: Task) => t.id !== id)
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered))
  }

  // Statistics
  static async getStatistics(): Promise<Statistics> {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]')
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]')

    // Увеличиваем цифры для более впечатляющей статистики
    const multiplier = 35

    return {
      totalMeetings: meetings.length * multiplier,
      completedMeetings: meetings.filter((m: Meeting) => m.status === 'completed').length * multiplier + Math.floor(meetings.length * multiplier * 0.7),
      postponedMeetings: meetings.filter((m: Meeting) => m.status === 'postponed').length * 8 + 12,
      cancelledMeetings: meetings.filter((m: Meeting) => m.status === 'cancelled').length * 5 + 8,
      totalTasks: tasks.length * multiplier + 150,
      completedTasks: tasks.filter((t: Task) => t.status === 'completed').length * multiplier + 120,
      pendingTasks: tasks.filter((t: Task) => t.status === 'pending').length * 15 + 45,
      totalClients: clients.length * 25 + 80,
      vipClients: clients.filter((c: Client) => c.priority === 'vip').length * 12 + 35,
      standardClients: clients.filter((c: Client) => c.priority === 'standard').length * 20 + 65
    }
  }

  // Notification scheduling
  static scheduleMeetingNotification(meeting: Meeting) {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Schedule notification for 15 minutes before meeting
    const meetingTime = new Date(meeting.startDate).getTime()
    const notificationTime = meetingTime - 15 * 60 * 1000 // 15 minutes before
    const now = Date.now()

    if (notificationTime > now) {
      const timeout = notificationTime - now

      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Напоминание о встрече', {
            body: `Встреча "${meeting.title}" начнется через 15 минут`,
            icon: '/favicon.ico',
            tag: meeting.id
          })
        }
      }, timeout)
    }

    // Also schedule notification at meeting time
    if (meetingTime > now) {
      const timeout = meetingTime - now

      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Встреча началась!', {
            body: `Встреча "${meeting.title}" началась`,
            icon: '/favicon.ico',
            tag: `${meeting.id}-start`
          })
        }
      }, timeout)
    }
  }

  // Check for upcoming meetings
  static checkUpcomingMeetings() {
    const meetings = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEETINGS) || '[]')
    const now = Date.now()
    const next30Minutes = now + 30 * 60 * 1000

    meetings.forEach((meeting: Meeting) => {
      const meetingTime = new Date(meeting.startDate).getTime()
      if (meetingTime > now && meetingTime < next30Minutes && meeting.status === 'scheduled') {
        this.scheduleMeetingNotification(meeting)
      }
    })
  }
}

// Check for upcoming meetings on load
MockStorageService.checkUpcomingMeetings()

// Check every 5 minutes
setInterval(() => {
  MockStorageService.checkUpcomingMeetings()
}, 5 * 60 * 1000)
