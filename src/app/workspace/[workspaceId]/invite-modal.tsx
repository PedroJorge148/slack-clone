import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm('Are you sure', 'This will deactivate the current code and generate a new one.')

  const { mutate, isPending } = useNewJoinCode()

  async function handleNewCode() {
    const ok = await confirm()

    if (!ok) return null

    mutate({ workspaceId }, {
      onSuccess: () => toast.success('Invite code regenerated!'),
      onError: () => toast.error('Failed to regenerate invite code')
    })
  }

  function handleCopy() {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Invite link copied to clipboard'))
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              onClick={handleNewCode}
              disabled={isPending}
            >
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}