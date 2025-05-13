/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom'
import CreateTaskDialog from '../task/create-task-dialog'
import EditProjectDialog from './edit-project-dialog'
import { useQuery } from '@tanstack/react-query'
import { getProjectByIdQueryFn } from '@/lib/api'
import useWorkspaceId from '@/hooks/use-workspace-id'

const ProjectHeader = () => {
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

  // Fallback if no project data is found
  const projectEmoji = '📊'
  const projectName = 'Untitled project'

  const renderContent = () => {
    if (isPending) return <span>Loading...</span>
    if (isError) return <span>Error occured</span>
    return (
      <>
        <span>{data.project.emoji}</span>
        {data.project.name}
      </>
    )
  }
  return (
    <div className='flex items-center justify-between space-y-2'>
      <div className='flex items-center gap-2'>
        <h2 className='flex items-center gap-3 text-xl font-medium truncate tracking-tight'>{renderContent()}</h2>
        <EditProjectDialog project={data?.project} />
      </div>
      <CreateTaskDialog projectId={projectId} />
    </div>
  )
}

export default ProjectHeader
