import { apiClient, type ApiEnvelope } from './client'
import type { User } from '../stores/authStore'

export interface OwnerLoginPayload {
  usernameOrEmail: string
  password: string
}

export interface OwnerAuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface IdentityResponse {
  type: 'user' | 'visitor'
  // user fields
  _id?: string
  username?: string
  email?: string
  avatar?: string
  role?: string
  level?: number
  exp?: number
  bio?: string
  location?: string
  website?: string
  socials?: Record<string, string>
  status?: string
  lastLoginAt?: string
  // visitor fields
  visitorId?: string
  nickname?: string
  city?: string
}

export async function ownerLogin(payload: OwnerLoginPayload) {
  const response = await apiClient.post<
    unknown,
    ApiEnvelope<OwnerAuthResponse>
  >('/auth/login', payload)

  return response.data
}

export async function refreshOwnerToken(refreshToken: string) {
  const response = await apiClient.post<
    unknown,
    ApiEnvelope<OwnerAuthResponse>
  >('/auth/refresh', { refreshToken })

  return response.data
}

export async function getCurrentIdentity(visitorId?: string) {
  const headers: Record<string, string> = {}
  if (visitorId) {
    headers['X-Visitor-ID'] = visitorId
  }

  const response = await apiClient.get<unknown, ApiEnvelope<IdentityResponse>>(
    '/auth/me',
    { headers },
  )

  return response.data
}
