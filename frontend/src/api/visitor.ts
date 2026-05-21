import { apiClient, type ApiEnvelope } from './client'

export interface VisitorSession {
  visitorId: string
  nickname: string
}

export async function createVisitorSession(visitorId?: string) {
  const response = await apiClient.post<unknown, ApiEnvelope<VisitorSession>>(
    '/visitors/session',
    visitorId ? { visitorId } : {},
  )

  return response.data
}
