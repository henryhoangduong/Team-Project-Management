import { ChevronDown, Loader } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper'
import { useAuthContext } from '@/context/auth-provider'
import useWorkspaceId from '@/hooks/use-workspace-id'
import { useGetWorkspaceMember } from '@/hooks/api/user-get-workspace-member'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeWorkspaceMemberRoleMutationFn } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { Permissions } from '@/constant'

const AllMembers = () => {
  const { user, hasPermission } = useAuthContext()
  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE)
  const workspaceId = useWorkspaceId()
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn
  })
  const { data, isPending } = useGetWorkspaceMember(workspaceId)
  const members = data?.members || []
  const roles = data?.roles || []
  const queryClient = useQueryClient()
  const handleSelect = (roleId: string, memberId: string) => {
    if (isPending || !roleId || !memberId) return
    mutate(
      {
        workspaceId: workspaceId,
        data: {
          roleId: roleId,
          memberId: memberId
        }
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
          toast({
            title: 'Success',
            description: data.message,
            variant: 'success'
          })
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          })
        }
      }
    )
  }
  return (
    <div className='grid gap-6 pt-2'>
      {isPending ? <Loader className='w-8 h-8 animate-spin place-self-center flex' /> : null}
      {members.map((member) => {
        const name = member.userId.name
        const email = member.userId.email
        const initials = getAvatarFallbackText(name)
        const role = member.role.name
        return (
          <div className='flex items-center justify-between space-x-4'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={member.userId.profilePicture || ''} alt='Image' />
                <AvatarFallback className={`${getAvatarColor(initials)}`}>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className='text-sm font-medium leading-none'>{name}</p>
                <p className='text-sm text-muted-foreground'>{email}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none'
                    disabled={isLoading || member.userId._id === user?._id || !canChangeMemberRole}
                  >
                    {role.toLowerCase()}{' '}
                    {canChangeMemberRole && member.userId._id != user?._id && (
                      <ChevronDown className='text-muted-foreground' />
                    )}
                  </Button>
                </PopoverTrigger>
                {canChangeMemberRole && (
                  <PopoverContent className='p-0' align='end'>
                    <Command>
                      <CommandInput placeholder='Select new role...' />
                      <CommandList>
                        {isLoading ? (
                          <Loader className='w-8 h-8 animate-spin place-self-center flex my-4' />
                        ) : (
                          <>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => {
                                return (
                                  <CommandItem
                                    onSelect={() => {
                                      handleSelect(role._id, member.userId._id)
                                    }}
                                    className='disabled:pointer-events-none gap-1 mb-1 teamaspace-y-1 flex flex-col items-start px-4 py-2'
                                  >
                                    {role.name !== 'OWNER' && (
                                      <>
                                        <p className='capitalize'>{role.name.toLowerCase()}</p>

                                        <p className='text-sm text-muted-foreground'>
                                          {role.name == 'ADMIN' && 'Admin-level access to all resources.'}
                                          {role.name == 'MEMBER' && 'Can view,edit only task created by.'}
                                        </p>
                                      </>
                                    )}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AllMembers
