import { apiClient, type ApiEnvelope } from './client'

export interface VisitorSession {
  visitorId: string
  nickname: string
  city?: string
}

/**
 * @deprecated 使用 getCurrentIdentity() 替代，统一通过 GET /auth/me 获取身份
 */
export async function createVisitorSession(visitorId?: string) {
  const response = await apiClient.post<unknown, ApiEnvelope<VisitorSession>>(
    '/visitors/session',
    visitorId ? { visitorId } : {},
  )

  return response.data
}
