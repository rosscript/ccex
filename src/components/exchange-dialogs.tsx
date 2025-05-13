"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExchangeForm } from "@/components/exchange-form"
import type { Exchange } from "@/lib/db"
import { Pencil } from "lucide-react"

interface AddExchangeDialogProps {
  onAdd: (data: { name: string; emails: string[] }) => void
}

export function AddExchangeDialog({ onAdd }: AddExchangeDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Aggiungi Exchange</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Exchange</DialogTitle>
        </DialogHeader>
        <ExchangeForm
          onSubmit={(data) => {
            onAdd(data)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface EditExchangeDialogProps {
  exchange: Exchange
  onEdit: (id: string, data: { name: string; emails: string[] }) => void
}

export function EditExchangeDialog({ exchange, onEdit }: EditExchangeDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Exchange</DialogTitle>
        </DialogHeader>
        <ExchangeForm
          exchange={exchange}
          onSubmit={(data) => {
            onEdit(exchange.id, data)
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 