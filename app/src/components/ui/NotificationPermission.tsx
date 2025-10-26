import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'

export const NotificationPermission = () => {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if notifications are supported and permission hasn't been granted
    if ('Notification' in window && Notification.permission === 'default') {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        // Show a test notification
        new Notification('Уведомления включены!', {
          body: 'Теперь вы будете получать напоминания о встречах',
          icon: '/favicon.ico'
        })
      }

      setShowPrompt(false)
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      setShowPrompt(false)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white rounded-lg shadow-2xl border border-gray-200 p-6 animate-slide-up">
      <button
        onClick={dismissPrompt}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Bell className="h-6 w-6 text-primary-600" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Включить уведомления?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Получайте напоминания о предстоящих встречах и важных событиях
          </p>

          <div className="flex space-x-3">
            <button
              onClick={requestPermission}
              className="btn-primary text-sm py-2 px-4"
            >
              Включить
            </button>
            <button
              onClick={dismissPrompt}
              className="text-sm py-2 px-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Не сейчас
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
