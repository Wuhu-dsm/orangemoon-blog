import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '../stores/authStore'
import type { OwnerAuthResponse } from './auth'

export interface ApiEnvelope<T> {
  code: number
  data: T
  message: string
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
})

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
})

let refreshPromise: Promise<OwnerAuthResponse> | null = null

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const refreshToken = useAuthStore.getState().refreshToken
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      refreshToken &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true

      try {
        refreshPromise ??= refreshClient
          .post<ApiEnvelope<OwnerAuthResponse>>('/auth/refresh', {
            refreshToken,
          })
          .then((response) => response.data.data)
          .finally(() => {
            refreshPromise = null
          })

        const auth = await refreshPromise
        useAuthStore
          .getState()
          .setAuth(auth.user, auth.accessToken, auth.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        redirectToOwnerLogin()

        return Promise.reject(refreshError)
      }
    }

    if (status === 401) {
      useAuthStore.getState().logout()
      redirectToOwnerLogin()
    }

    return Promise.reject(error.response?.data || error)
  },
)

function redirectToOwnerLogin() {
  if (window.location.pathname === '/owner-login') {
    return
  }

  const returnTo = `${window.location.pathname}${window.location.search}`
  window.location.href = `/owner-login?returnTo=${encodeURIComponent(returnTo)}`
}
