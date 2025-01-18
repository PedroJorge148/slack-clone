import { AlertTriangle, HashIcon, Loader2, MessageSquareText, SendHorizontal } from "lucide-react"

import { useCurrentMember } from "@/features/members/api/use-current-member"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useChannelId } from "@/hooks/use-channel-id"

import { WorkspaceHeader } from "./workspace-header"
import { WorkspaceSection } from "./workspace-section"
import { SidebarItem } from "./sidebar-item"
import { UserItem } from "./user-item"

export function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const [_, setOpen] = useCreateChannelModal()

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizontal}
          id="drafts"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            id={item._id}
            icon={HashIcon}
            label={item.name}
            variant={channelId === item._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => { }}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}