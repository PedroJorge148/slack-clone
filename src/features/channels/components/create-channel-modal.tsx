import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export function CreateChannelModal() {
  const workspaceId = useWorkspaceId()

  const [name, setName] = useState('')
  const [open, setOpen] = useCreateChannelModal()

  const { mutate, isPending } = useCreateChannel()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setName(value)
  }

  function handleClose() {
    setName('')
    setOpen(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    mutate(
      {
        name,
        workspaceId
      },
      {
        onSuccess: () => {
          // TODO: Redirect to new channel
          handleClose()
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={30}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}