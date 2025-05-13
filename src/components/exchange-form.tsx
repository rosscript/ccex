"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { Exchange } from "@/lib/db"

interface ExchangeFormProps {
  exchange?: Exchange
  onSubmit: (data: { name: string; emails: string[] }) => void
  onCancel: () => void
}

export function ExchangeForm({ exchange, onSubmit, onCancel }: ExchangeFormProps) {
  const [name, setName] = useState(exchange?.name || "")
  const [emails, setEmails] = useState<string[]>(exchange?.emails || [""])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      emails: emails.filter(email => email.trim() !== "")
    })
  }

  const addEmail = () => {
    setEmails([...emails, ""])
  }

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Exchange</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Inserisci il nome dell'exchange"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Indirizzi Email</Label>
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => updateEmail(index, e.target.value)}
                placeholder="email@example.com"
                required
              />
              {emails.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEmail(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEmail}
          className="mt-2"
        >
          Aggiungi Email
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit">
          {exchange ? "Salva Modifiche" : "Aggiungi Exchange"}
        </Button>
      </div>
    </form>
  )
} 