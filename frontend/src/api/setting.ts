import { apiClient, type ApiEnvelope } from './client'

export interface SiteProfileStat {
  label: string
  value: string
}

export interface SiteProfileSocial {
  icon: string
  label: string
  href: string
}

export interface SiteProfile {
  nickname: string
  avatar: string
  title: string
  bio: string
  level: number
  stats: SiteProfileStat[]
  socials: SiteProfileSocial[]
}

export interface SiteSetting {
  _id: string
  banners: string[]
  profile: SiteProfile
  createdAt: string
  updatedAt: string
}

export interface UpdateSettingDto {
  banners?: string[]
  profile?: SiteProfile
}

export async function fetchSettings(): Promise<SiteSetting | null> {
  const response = await apiClient.get<unknown, ApiEnvelope<SiteSetting | null>>(
    '/settings',
  )
  return response.data
}

export async function updateSettings(
  dto: UpdateSettingDto,
): Promise<SiteSetting> {
  const response = await apiClient.patch<unknown, ApiEnvelope<SiteSetting>>(
    '/settings',
    dto,
  )
  return response.data
}
