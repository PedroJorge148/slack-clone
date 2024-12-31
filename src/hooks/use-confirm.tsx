import { useState } from "react"

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function useConfirm(
  title: string,
  message: string
): [any, any] {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void} | null>(null)

  function confirm() {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }

  function handleClose() {
    setPromise(null)
  }

  function handleCancel() {
    promise?.resolve(false)
    handleClose()
  }

  function handleConfirm() {
    promise?.resolve(true)
    handleClose()
  }

  const ConfirmDialog = () => (
    <Dialog open={!!promise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return [ConfirmDialog, confirm]
}