import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  destructive?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export default function ConfirmationDialog({
  trigger,
  title,
  description,
  destructive = false,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Annuler</Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={handleConfirm}>{destructive? "Oui, je suis sûr(e)" : "Confirmer" }</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}