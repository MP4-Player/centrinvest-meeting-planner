import { useState, useEffect } from 'react'
import { Search, MapPin, Navigation, Route, Zap, Target } from 'lucide-react'
import { apiService } from '@/services/api'
import { Kaleidoscope } from '@/components/ui/Kaleidoscope'

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
      <div className="flex-1 relative bg-gradient-to-br from-primary-50 to-accent-50">
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
              <p className="text-text-secondary text-lg">Загрузка карты...</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative overflow-hidden">
            {/* Калейдоскоп дашборда */}
            <div className="absolute inset-0">
              <Kaleidoscope />
            </div>

            {/* Интерактивные элементы поверх калейдоскопа */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-white/90">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  Интерактивная карта
                </h3>
                <p className="text-xl mb-8 max-w-2xl">
                  Здесь будет отображаться карта с местоположениями встреч, клиентов и задач
                </p>
                
                {/* Информационные карточки */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl pointer-events-auto">
                  <div className="card glass-effect p-6 text-text-primary">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Встречи</h4>
                    <p className="text-sm text-text-secondary">Места проведения встреч</p>
                  </div>
                  <div className="card glass-effect p-6 text-text-primary">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Клиенты</h4>
                    <p className="text-sm text-text-secondary">Адреса клиентов</p>
                  </div>
                  <div className="card glass-effect p-6 text-text-primary">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Задачи</h4>
                    <p className="text-sm text-text-secondary">Места выполнения задач</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Анимированные маркеры */}
            <div className="absolute top-1/4 left-1/4 animate-float">
              <div className="w-6 h-6 bg-primary-500 rounded-full shadow-lg animate-pulse"></div>
            </div>
            <div className="absolute top-1/3 right-1/3 animate-pulse-slow">
              <div className="w-6 h-6 bg-accent-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-bounce-slow">
              <div className="w-6 h-6 bg-secondary-500 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 animate-star-twinkle">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full shadow-lg"></div>
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
