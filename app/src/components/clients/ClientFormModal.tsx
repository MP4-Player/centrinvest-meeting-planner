import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Client, CreateClientData } from '@/types'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (client: CreateClientData) => void
  client?: Client
  mode: 'create' | 'edit'
}

export const ClientFormModal = ({
  isOpen,
  onClose,
  onSave,
  client,
  mode,
}: ClientFormModalProps) => {
  const [formData, setFormData] = useState<CreateClientData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    priority: 'standard',
  })

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        company: client.company || '',
        position: client.position || '',
        address: client.address,
        priority: client.priority,
      })
    } else {
      // Reset form for create mode
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        address: '',
        priority: 'standard',
      })
    }
  }, [client, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Добавить клиента' : 'Редактировать клиента'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* First Name and Last Name in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Имя *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Имя"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Фамилия *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="Фамилия"
                />
              </div>
            </div>

            {/* Email and Phone in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field text-sm py-2"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            {/* Company and Position in one row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Компания
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                  placeholder="Название компании"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Должность
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                  placeholder="Должность"
                />
              </div>
            </div>

            {/* Address - full width */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Адрес *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input-field text-sm py-2"
                placeholder="Полный адрес"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Приоритет *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="standard"
                    checked={formData.priority === 'standard'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Стандарт</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="vip"
                    checked={formData.priority === 'vip'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-purple-700 font-semibold">VIP</span>
                </label>
              </div>
            </div>

            {/* Actions - compact buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary text-sm py-2"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
