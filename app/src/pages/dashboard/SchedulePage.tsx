import { useMeetings, useOptimizeRoute } from '@/hooks/useMeetings'
import { ScheduleItem } from '@/types'
import { ScheduleTab } from '@/components/meetings/ScheduleTab'
import toast from 'react-hot-toast'
import { useState, useMemo } from 'react'
import { useSearch } from '@/contexts/SearchContext'

export const SchedulePage = () => {
  const { data: meetingsData, isLoading } = useMeetings({})
  const { searchQuery } = useSearch()
  const optimizeRoute = useOptimizeRoute()
  const [optimizedSchedule, setOptimizedSchedule] = useState<ScheduleItem[] | null>(null)

  const meetings = meetingsData?.data || []

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

  const schedule: ScheduleItem[] = optimizedSchedule || filteredMeetings.map((meeting, index) => ({
    id: `schedule-${meeting.id}`,
    meetingId: meeting.id,
    meeting,
    order: index + 1,
  }))

  const handleSaveSchedule = (updatedSchedule: ScheduleItem[]) => {
    try {
      // Сохраняем обновленный порядок и даты встреч в localStorage
      const allMeetings = JSON.parse(localStorage.getItem('mock_meetings') || '[]')

      const updatedMeetings = allMeetings.map((m: any) => {
        const scheduleItem = updatedSchedule.find(item => item.meeting.id === m.id)
        if (scheduleItem) {
          return {
            ...m,
            ...scheduleItem.meeting,
            order: scheduleItem.order
          }
        }
        return m
      })

      localStorage.setItem('mock_meetings', JSON.stringify(updatedMeetings))
      toast.success('Расписание успешно сохранено')
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error('Ошибка при сохранении расписания')
    }
  }

  const handleOptimizeRoute = async () => {
    try {
      const meetingIds = meetings.map(m => m.id)

      const result = await optimizeRoute.mutateAsync({
        meetingIds,
        startLocation: {
          latitude: 55.7558,
          longitude: 37.6176,
          address: 'Москва, Центр'
        }
      })

      setOptimizedSchedule(result.optimizedSchedule)
      toast.success(`Маршрут оптимизирован! Общее расстояние: ${(result.totalDistance / 1000).toFixed(1)} км`)
    } catch (error: any) {
      toast.error(error.message || 'Ошибка оптимизации маршрута')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка расписания...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ScheduleTab
        schedule={schedule}
        onSave={handleSaveSchedule}
        onOptimizeRoute={handleOptimizeRoute}
        isOptimizing={optimizeRoute.isPending}
      />
    </div>
  )
}
