import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Meeting, CreateMeetingData, MeetingFilters } from '@/types'
import toast from 'react-hot-toast'

export const useMeetings = (filters?: MeetingFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['meetings', filters, page, limit],
    queryFn: () => apiService.get('/meetings', { ...filters, page, limit }),
  })
}

export const useMeeting = (id: string) => {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => apiService.get(`/meetings/${id}`),
    enabled: !!id,
  })
}

export const useCreateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMeetingData) => apiService.post('/meetings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      toast.success('Встреча создана успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка создания встречи')
    },
  })
}

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMeetingData> }) =>
      apiService.put(`/meetings/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      queryClient.invalidateQueries({ queryKey: ['meeting', id] })
      toast.success('Встреча обновлена успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления встречи')
    },
  })
}

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/meetings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      toast.success('Встреча удалена успешно!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка удаления встречи')
    },
  })
}

export const useRecurringMeetings = () => {
  return useQuery({
    queryKey: ['meetings', 'recurring'],
    queryFn: () => apiService.get('/meetings/recurring'),
  })
}
