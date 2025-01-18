'use client'

import { Loader2, TriangleAlertIcon } from "lucide-react"
import { useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"

import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"

import { useWorkspaceId } from "@/hooks/use-workspace-id"

export default function WorkspaceIdPage() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [open, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })

  const channelId = useMemo(() => channels?.[0]._id, [channels])
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && isAdmin) {
      setOpen(true)
    }
  }, [
    workspace,
    workspaceId,
    workspaceLoading,
    channelId,
    channelsLoading,
    member,
    memberLoading,
    isAdmin,
    router,
    open,
    setOpen
  ])

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (workspace) {
    return (
      <div className="h-full flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlertIcon className="size-6 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlertIcon className="size-6 animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        No channel found
      </span>
    </div>
  )
}