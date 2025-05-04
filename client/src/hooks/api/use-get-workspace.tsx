import { getWorkspaceByIdQueryFn } from '@/lib/api'
import { CustomError } from '@/types/custom-error.type'
import { useQuery } from '@tanstack/react-query'

const useGetWorkspaceQuery = (workspaceId: string) => {
  const query = useQuery<any, CustomError>({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn,
    staleTime: 0,
    retry: 2
  })
  return query
}

export default useGetWorkspaceQuery
