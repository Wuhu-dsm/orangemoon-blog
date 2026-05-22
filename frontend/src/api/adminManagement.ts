import { apiClient, type ApiEnvelope } from './client'

export type AdminUserRole = 'admin' | 'user'
export type AdminUserStatus = 'active' | 'banned'

export interface AdminUser {
  _id: string
  email: string
  username: string
  avatar?: string
  role: AdminUserRole
  status: AdminUserStatus
  level: number
  exp: number
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface AdminUserListParams {
  page?: number
  pageSize?: number
  search?: string
  role?: AdminUserRole
  status?: AdminUserStatus
}

export interface AdminUserListResponse {
  items: AdminUser[]
  total: number
}

export interface AdminUpdateUserDto {
  role?: AdminUserRole
  status?: AdminUserStatus
}

export async function findAllAdminUsers(params?: AdminUserListParams) {
  const response = await apiClient.get<
    unknown,
    ApiEnvelope<AdminUserListResponse>
  >('/admin/users', { params })

  return response.data
}

export async function updateAdminUser(id: string, dto: AdminUpdateUserDto) {
  const response = await apiClient.patch<unknown, ApiEnvelope<AdminUser>>(
    `/admin/users/${id}`,
    dto,
  )

  return response.data
}
