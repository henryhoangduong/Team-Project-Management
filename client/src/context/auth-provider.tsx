import { createContext, useContext, useEffect } from 'react'
import useWorkspaceId from '@/hooks/use-workspace-id'
import { UserType, WorkspaceType } from '@/types/api.type'
import useAuth from '@/hooks/api/use-auth'
import { useNavigate } from 'react-router-dom'
import useGetWorkspaceQuery from '@/hooks/api/use-get-workspace'
import { PermissionType } from '@/constant'
import usePermissions from '@/hooks/use-permissions'
// Define the context shape
type AuthContextType = {
  user?: UserType
  workspace?: WorkspaceType
  hasPermission: (permission: PermissionType) => boolean;
  error: any
  isLoading: boolean
  isFetching: boolean
  workspaceLoading: boolean
  refetchAuth: () => void
  refetchWorkspace: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const workspaceId = useWorkspaceId()
  const { data: authData, error: authError, isLoading, isFetching, refetch: refetchAuth } = useAuth()

  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace
  } = useGetWorkspaceQuery(workspaceId)

  const user = authData?.user
  const workspace = workspaceData?.workspace

  useEffect(() => {
    if (workspaceError) {
      if (workspaceError?.errorCode === 'ACCESS_UNAUTHORIZED') {
        navigate('/') // Redirect if the user is not a member of the workspace
      }
    }
  }, [navigate, workspaceError])
  const permissions = usePermissions(user, workspace)
  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission)
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: authError || workspaceError,
        isLoading,
        isFetching,
        workspaceLoading,
        refetchAuth,
        refetchWorkspace
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useCurrentUserContext must be used within a AuthProvider')
  }
  return context
}
