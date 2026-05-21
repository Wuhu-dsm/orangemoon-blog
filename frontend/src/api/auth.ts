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
