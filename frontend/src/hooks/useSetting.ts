import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchSettings, updateSettings, type UpdateSettingDto } from '@/api/setting'

export const settingKeys = {
  all: ['settings'] as const,
}

export function useSettings() {
  return useQuery({
    queryKey: settingKeys.all,
    queryFn: () => fetchSettings(),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateSettingDto) => updateSettings(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all })
      toast.success('配置保存成功')
    },
    onError: () => toast.error('配置保存失败'),
  })
}
