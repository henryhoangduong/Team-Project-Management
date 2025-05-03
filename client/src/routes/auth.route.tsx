import useAuth from '@/hooks/api/use-auth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthRoute } from './common/routePaths'
import { DashboardSkeleton } from '@/components/skeleton-loaders/dashboard-skeleton'

const AuthRoute = () => {
  const location = useLocation()
  const _isAuthRoute = isAuthRoute(location.pathname)
  const { data: authData, isLoading } = useAuth()
  const user = authData?.user
  if (isLoading && !_isAuthRoute) return <DashboardSkeleton />
  if (!user) return <Outlet />
  return <Navigate to={`workspace/${user?.currentWorkspace?._id}`} />
}

export default AuthRoute
