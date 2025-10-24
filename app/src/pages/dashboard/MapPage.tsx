import { useState, useEffect } from 'react'
import { Search, MapPin, Navigation, Route } from 'lucide-react'
import { apiService } from '@/services/api'

export const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [locations, setLocations] = useState([])

  useEffect(() => {
    // Load map locations
    const loadLocations = async () => {
      try {
        const data = await apiService.get('/map/locations')
        setLocations(data)
        setMapLoaded(true)
      } catch (error) {
        console.error('Error loading locations:', error)
        setMapLoaded(true)
      }
    }

    loadLocations()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement address search
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Местоположения
            </button>
            <button className="btn-secondary flex items-center">
              <Route className="h-4 w-4 mr-2" />
              Маршруты
            </button>
            <button className="btn-primary flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              Навигация
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка карты...</p>
            </div>
          </div>
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
            {/* Mock Map Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Интерактивная карта
                </h3>
                <p className="text-gray-600 mb-4">
                  Здесь будет отображаться карта с местоположениями встреч, клиентов и задач
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Встречи</h4>
                    <p className="text-sm text-gray-600">Места проведения встреч</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Клиенты</h4>
                    <p className="text-sm text-gray-600">Адреса клиентов</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Задачи</h4>
                    <p className="text-sm text-gray-600">Места выполнения задач</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Map Markers */}
            <div className="absolute top-1/4 left-1/4">
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute top-1/3 right-1/3">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/3">
              <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-1/4 right-1/4">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Встречи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Клиенты</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Задачи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">VIP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
