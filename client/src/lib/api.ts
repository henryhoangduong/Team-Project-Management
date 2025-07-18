import API from './axios-client'
import {
  AllMembersInWorkspaceResponseType,
  AllProjectResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  EditProjectPayloadType,
  EditWorkspaceType,
  LoginResponseType,
  loginType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  registerType,
  WorkspaceByIdResponseType
} from '@/types/api.type'

export const loginMutationFn = async (data: loginType): Promise<LoginResponseType> => {
  const response = await API.post('/auth/login', data)
  return response.data
}

export const registerMutationFn = async (data: registerType) => await API.post('/auth/register', data)

export const logoutMutationFn = async () => await API.get('auth/logout')

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get(`/user/current`)
  return response.data
}

//********* WORKSPACE ****************
//************* */
export const getAllWorkspacesUserIsMemberQueryFn = async (): Promise<AllWorkspaceResponseType> => {
  const response = await API.get(`/workspace/all`)
  return response.data
}
export const createWorkspaceMutationFn = async (data: CreateWorkspaceType): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data)
  return response.data
}

export const editWorkspaceMutationFn = async ({ workspaceId, data: { name, description } }: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, { name: name, description: description })
  return response.data
}

export const getWorkspaceByIdQueryFn = async (workspaceId: string): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`)
  return response.data
}

export const getWorkspaceAnalyticsQueryFn = async (workspaceId: string): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`)
  return response.data
}

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data
}: ChangeWorkspaceMemberRoleType): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.put(`/workspace/change/member/role/${workspaceId}`, data)
  return response.data
}

export const getMembersInWorkspaceQueryFn = async (workspaceId: string): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`)
  return response.data
}

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string
  currentWorkspace: string
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`)
  return response.data
}

//******* MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{ message: string; workspaceId: string }> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`)
  return response.data
}

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(`/project/workspace/${workspaceId}/create`, data)
  return response.data
}

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(`/project/${projectId}/workspace/${workspaceId}/update`, data)
  return response.data
}

export const getProjectsInWorkspaceQueryFn = async (
  workspaceId: string,
  pageSize: number,
  pageNumer: number
): Promise<AllProjectResponseType> => {
  const response = await API.get(`/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumer}`)
  return response.data
}

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const responee = await API.get(`/project/${projectId}/workspace/${workspaceId}`)
  return responee.data
}

export const getProjectAnalyticsQueryFn = async (
  workspaceId: string,
  projectId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/project/${projectId}/workspace/${workspaceId}/analytics`)
  return response.data
}

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId
}: ProjectByIdPayloadType): Promise<{
  message: string
}> => {
  const response = await API.delete(`/project/${projectId}/workspace/${workspaceId}/delete`)
  return response.data
}

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({ workspaceId, projectId, data }: CreateTaskPayloadType) => {
  const response = await API.post(`/task/project/${projectId}/workspace/${workspaceId}/create`, data)
  return response.data
}
export const getAllTasksQueryFn = async () => {}

export const deleteTaskMutationFn = async () => {}
