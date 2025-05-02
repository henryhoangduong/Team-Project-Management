import { getWorkspaceByIdQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetWorkspaceQuery = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn,
    staleTime: 0,
    retry: 2
  })
  return query
}

export default useGetWorkspaceQuery
