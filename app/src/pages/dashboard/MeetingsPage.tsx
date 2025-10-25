import { useState } from 'react'
import { Plus, Search, Filter, Calendar, Clock, MapPin, User } from 'lucide-react'
import { useMeetings } from '@/hooks/useMeetings'
import { MeetingFilters } from '@/types'

export const MeetingsPage = () => {
  const [filters, setFilters] = useState<MeetingFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'meetings' | 'recurring'>('meetings')

  const { data: meetingsData, isLoading } = useMeetings({
    ...filters,
    search: searchQuery || undefined,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === 'vip' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Встречи</h1>
          <button className="btn-primary flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Добавить встречу
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('meetings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'meetings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Встречи
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recurring'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Регулярные встречи
            </button>
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск встреч..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                  className="input-field"
                >
                  <option value="">Все статусы</option>
                  <option value="scheduled">Запланирована</option>
                  <option value="completed">Завершена</option>
                  <option value="cancelled">Отменена</option>
                  <option value="postponed">Отложена</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Приоритет
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
                  className="input-field"
                >
                  <option value="">Все приоритеты</option>
                  <option value="vip">VIP</option>
                  <option value="standard">Стандарт</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата от
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата до
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Meetings - Desktop Table View */}
      <div className="hidden md:block card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Встреча
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Время
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Место
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Загрузка...
                  </td>
                </tr>
              ) : meetingsData?.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Встречи не найдены
                  </td>
                </tr>
              ) : (
                meetingsData?.data.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {meeting.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {meeting.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{meeting.clientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(meeting.startDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(meeting.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        {meeting.location}
                      </div>
                      <div className="text-sm text-gray-500">{meeting.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                        {meeting.status === 'scheduled' && 'Запланирована'}
                        {meeting.status === 'completed' && 'Завершена'}
                        {meeting.status === 'cancelled' && 'Отменена'}
                        {meeting.status === 'postponed' && 'Отложена'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(meeting.priority)}`}>
                        {meeting.priority === 'vip' ? 'VIP' : 'Стандарт'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          Редактировать
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meetings - Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="card p-6 text-center text-gray-500">
            Загрузка...
          </div>
        ) : meetingsData?.data.length === 0 ? (
          <div className="card p-6 text-center text-gray-500">
            Встречи не найдены
          </div>
        ) : (
          meetingsData?.data.map((meeting) => (
            <div key={meeting.id} className="card p-4">
              <div className="space-y-3">
                {/* Title and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{meeting.description}</p>
                  </div>
                  <div className="ml-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status === 'scheduled' && 'Запланирована'}
                      {meeting.status === 'completed' && 'Завершена'}
                      {meeting.status === 'cancelled' && 'Отменена'}
                      {meeting.status === 'postponed' && 'Отложена'}
                    </span>
                  </div>
                </div>

                {/* Client */}
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{meeting.clientName}</span>
                  <span className={`ml-auto inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(meeting.priority)}`}>
                    {meeting.priority === 'vip' ? 'VIP' : 'Стандарт'}
                  </span>
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{formatDate(meeting.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{formatDate(meeting.endDate)}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="text-sm text-gray-500 ml-6">{meeting.address}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 pt-2 border-t border-gray-200">
                  <button className="flex-1 text-center text-sm text-primary-600 hover:text-primary-900 font-medium">
                    Редактировать
                  </button>
                  <button className="flex-1 text-center text-sm text-red-600 hover:text-red-900 font-medium">
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
