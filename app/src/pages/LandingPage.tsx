import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Calendar, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Shield,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary-600" />,
      title: 'Отслеживание местоположения',
      description: 'Отслеживайте местоположение встреч и находите кратчайший путь к клиентам'
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: 'Управление встречами',
      description: 'Планируйте и управляйте встречами с автоматическим построением маршрутов'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'База клиентов',
      description: 'Ведите полную базу клиентов с приоритизацией и историей взаимодействий'
    },
    {
      icon: <CheckSquare className="h-8 w-8 text-primary-600" />,
      title: 'Управление задачами',
      description: 'Создавайте, назначайте и отслеживайте выполнение задач'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary-600" />,
      title: 'Детальная отчетность',
      description: 'Получайте подробную аналитику по встречам, задачам и эффективности'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Безопасность данных',
      description: 'Надежная защита корпоративных данных с шифрованием и контролем доступа'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">ЦентрИнвест</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">Возможности</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">О нас</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900">Контакты</a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-900 font-medium"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Зарегистрироваться
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="block px-3 py-2 text-gray-500 hover:text-gray-900">Возможности</a>
                <a href="#about" className="block px-3 py-2 text-gray-500 hover:text-gray-900">О нас</a>
                <a href="#contact" className="block px-3 py-2 text-gray-500 hover:text-gray-900">Контакты</a>
                <div className="pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-500 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Зарегистрироваться
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Эффективное управление временем и бизнесом на одной платформе
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Автоматизируйте задачи, отслеживайте местоположение встреч и кратчайший путь, 
                повышайте производительность вашего бизнеса.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center"
                >
                  Создать аккаунт
                  <ArrowRight className="inline-block ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-center"
                >
                  Подробнее о функциях
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-8 text-gray-900">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold">Дашборд управления встречами</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">24</div>
                      <div className="text-sm text-gray-600">Встречи сегодня</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">18</div>
                      <div className="text-sm text-gray-600">Завершено</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Встреча с клиентом А</span>
                      <span className="text-xs text-gray-500">14:00</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Презентация проекта</span>
                      <span className="text-xs text-gray-500">16:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наши возможности
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Комплексное решение для управления встречами, клиентами и задачами
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ЦентрИнвест</h3>
              <p className="text-gray-400">
                Управление встречами и бизнес-процессами
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Возможности</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Цены</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Помощь</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Документация</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2023 ЦентрИнвест. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
