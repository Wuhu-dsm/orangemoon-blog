import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || user?.role !== 'admin') {
    const returnTo = `${location.pathname}${location.search}`
    return (
      <Navigate
        to={`/owner-login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    )
  }

  return <>{children}</>
}
