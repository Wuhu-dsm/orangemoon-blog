import { apiClient, type ApiEnvelope } from './client'

export type UploadPurpose =
  | 'avatar'
  | 'article-cover'
  | 'article-image'
  | 'note-image'
  | 'project-cover'
  | 'project-screenshot'
  | 'guestbook-image'

export interface UploadImageResponse {
  url: string
  filename: string
  purpose: UploadPurpose
  size: number
  mimeType: string
}

export async function uploadImage(file: File, purpose: UploadPurpose) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<
    unknown,
    ApiEnvelope<UploadImageResponse>
  >(`/uploads/image?purpose=${encodeURIComponent(purpose)}`, formData)

  return response.data
}
