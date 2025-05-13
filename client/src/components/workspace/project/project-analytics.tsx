import { useParams } from 'react-router-dom'
import AnalyticsCard from '../common/analytics-card'
import useWorkspaceId from '@/hooks/use-workspace-id'
import { useQuery } from '@tanstack/react-query'
import { getProjectByIdQueryFn } from '@/lib/api'

const ProjectAnalytics = () => {
  const param = useParams()
  const projectId = param.projectId as string
  const workspaceId = useWorkspaceId()
  const { data, isPending, isError } = useQuery({
    queryKey: ['singleProject', projectId],
    queryFn: () =>
      getProjectByIdQueryFn({
        workspaceId,
        projectId
      })
  })
  const analyticsList = [
    {
      id: 'total-task',
      title: 'Total Task',
      value: 10
    },
    {
      id: 'overdue-task',
      title: 'Overdue Task',
      value: 30
    },
    {
      id: 'completed-task',
      title: 'Completed Task',
      value: 18
    }
  ]

  return (
    <div className='grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3'>
      {analyticsList?.map((v) => <AnalyticsCard title={v.title} value={v.value} key={v.id} />)}
    </div>
  )
}

export default ProjectAnalytics
