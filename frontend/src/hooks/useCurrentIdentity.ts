import { useEffect } from 'react'
import { getCurrentIdentity } from '../api/auth'
import { useAuthStore } from '../stores/authStore'
import { useVisitorStore } from '../stores/visitorStore'

type ApiError = {
  message?: string
}

export function useCurrentIdentity() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const setVisitor = useVisitorStore((state) => state.setVisitor)
  const setLoading = useVisitorStore((state) => state.setLoading)
  const setError = useVisitorStore((state) => state.setError)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const storedVisitorId = useVisitorStore.getState().visitorId

    console.log('[useCurrentIdentity] start, storedVisitorId:', storedVisitorId)

    getCurrentIdentity(storedVisitorId ?? undefined)
      .then((identity) => {
        console.log('[useCurrentIdentity] response:', identity)
        if (cancelled) {
          console.log('[useCurrentIdentity] cancelled, skip update')
          return
        }

        if (identity.type === 'user') {
          const userData = {
            _id: identity._id!,
            username: identity.username!,
            email: identity.email!,
            avatar: identity.avatar,
            role: identity.role!,
            level: identity.level ?? 1,
            status: identity.status,
          }
          console.log('[useCurrentIdentity] setUser:', userData)
          setUser(userData)
        } else {
          if (isAuthenticated) {
            console.log('[useCurrentIdentity] token invalid, logout')
            logout()
          }
          console.log('[useCurrentIdentity] setVisitor:', identity.visitorId, identity.nickname)
          setVisitor(identity.visitorId!, identity.nickname!)
        }
      })
      .catch((error: ApiError) => {
        console.error('[useCurrentIdentity] error:', error)
        if (!cancelled) {
          setError(error.message || '身份初始化失败，请稍后再试')
        }
      })
      .finally(() => {
        console.log('[useCurrentIdentity] finally, cancelled:', cancelled)
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      console.log('[useCurrentIdentity] cleanup')
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
