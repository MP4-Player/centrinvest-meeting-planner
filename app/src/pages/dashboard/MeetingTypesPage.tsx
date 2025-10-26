import { useState, useMemo } from 'react'
import { useMeetings, useCreateMeeting, useUpdateMeeting, useDeleteMeeting } from '@/hooks/useMeetings'
import { MeetingWithType } from '@/types'
import { MeetingTypesTab } from '@/components/meetings/MeetingTypesTab'
import { MeetingFormModal } from '@/components/meetings/MeetingFormModal'
import { useAuth } from '@/hooks/useAuth'
import { useSearch } from '@/contexts/SearchContext'
import toast from 'react-hot-toast'

export const MeetingTypesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<MeetingWithType | undefined>()
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [startingPoint, setStartingPoint] = useState<string>('')

  const { user } = useAuth()
  const { searchQuery } = useSearch()
  const { data: meetingsData, isLoading } = useMeetings({})
  const createMeeting = useCreateMeeting()
  const updateMeeting = useUpdateMeeting()
  const deleteMeeting = useDeleteMeeting()

  const meetings: MeetingWithType[] = meetingsData?.data || []

  // Filter meetings based on search query
  const filteredMeetings = useMemo(() => {
    if (!searchQuery.trim()) return meetings

    const query = searchQuery.toLowerCase()
    return meetings.filter((meeting) => {
      return (
        meeting.title?.toLowerCase().includes(query) ||
        meeting.clientName?.toLowerCase().includes(query) ||
        meeting.location?.toLowerCase().includes(query) ||
        meeting.address?.toLowerCase().includes(query) ||
        meeting.description?.toLowerCase().includes(query)
      )
    })
  }, [meetings, searchQuery])

  const handleCreateMeeting = () => {
    setModalMode('create')
    setEditingMeeting(undefined)
    setIsModalOpen(true)
  }

  const handleEditMeeting = (meeting: MeetingWithType) => {
    setModalMode('edit')
    setEditingMeeting(meeting)
    setIsModalOpen(true)
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту встречу?')) {
      await deleteMeeting.mutateAsync(meetingId)
    }
  }

  const handleSaveMeetings = async (updatedMeetings: MeetingWithType[]) => {
    // Сохраняем обновленные типы встреч в localStorage
    const allMeetings = JSON.parse(localStorage.getItem("mock_meetings") || "[]")

    const updatedAllMeetings = allMeetings.map((m: any) => {
      const updatedMeeting = updatedMeetings.find(um => um.id === m.id)
      if (updatedMeeting) {
        return {
          ...m,
          meetingType: updatedMeeting.meetingType
        }
      }
      return m
    })

    localStorage.setItem("mock_meetings", JSON.stringify(updatedAllMeetings))
    toast.success('Встречи обновлены')
  }

  const handleSaveMeeting = async (meeting: Partial<MeetingWithType>) => {
    try {
      const meetingData = {
        title: meeting.title || '',
        description: meeting.description || '',
        clientId: meeting.clientId || '',
        employeeId: user?.id || '',
        startDate: meeting.startDate || new Date().toISOString(),
        endDate: meeting.endDate || new Date().toISOString(),
        location: meeting.location || '',
        address: meeting.address || '',
        priority: meeting.priority || 'standard' as 'standard' | 'vip',
        isRecurring: false,
        recurringPattern: undefined,
        meetingType: meeting.meetingType
      }

      if (modalMode === 'create') {
        await createMeeting.mutateAsync(meetingData)

        // Показать уведомление о создании
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Встреча создана!', {
            body: `Встреча "${meeting.title}" успешно создана`,
            icon: '/favicon.ico'
          })
        }
      } else if (editingMeeting?.id) {
        await updateMeeting.mutateAsync({
          id: editingMeeting.id,
          meeting: meetingData
        })
      }

      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Ошибка при сохранении встречи')
    }
  }

  const handleSetStartingPoint = (address: string) => {
    setStartingPoint(address)
    toast.success(`Стартовая точка: ${address}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка встреч...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <MeetingTypesTab
        meetings={filteredMeetings}
        onSave={handleSaveMeetings}
        onCreateMeeting={handleCreateMeeting}
        onEditMeeting={handleEditMeeting}
        onDeleteMeeting={handleDeleteMeeting}
        startingPoint={startingPoint}
        onSetStartingPoint={handleSetStartingPoint}
      />

      <MeetingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeeting}
        meeting={editingMeeting}
        mode={modalMode}
      />
    </div>
  )
}
