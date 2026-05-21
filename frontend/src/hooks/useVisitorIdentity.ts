import { useEffect } from 'react'
import { createVisitorSession } from '../api/visitor'
import { useAuthStore } from '../stores/authStore'
import { useVisitorStore } from '../stores/visitorStore'

type ApiError = {
  message?: string
}

export function useVisitorIdentity() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const visitorId = useVisitorStore((state) => state.visitorId)
  const nickname = useVisitorStore((state) => state.nickname)
  const setVisitor = useVisitorStore((state) => state.setVisitor)
  const setLoading = useVisitorStore((state) => state.setLoading)
  const setError = useVisitorStore((state) => state.setError)

  useEffect(() => {
    if (isAuthenticated || (visitorId && nickname)) {
      return
    }

    let cancelled = false
    setLoading(true)

    createVisitorSession(visitorId ?? undefined)
      .then((visitor) => {
        if (!cancelled) {
          setVisitor(visitor.visitorId, visitor.nickname)
        }
      })
      .catch((error: ApiError) => {
        if (!cancelled) {
          setError(error.message || '访客身份初始化失败，请稍后再试')
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    isAuthenticated,
    nickname,
    setError,
    setLoading,
    setVisitor,
    visitorId,
  ])
}
