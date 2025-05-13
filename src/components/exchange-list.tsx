"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { type Exchange } from "@/lib/db"
import { AddExchangeDialog } from "@/components/exchange-dialogs"
import { EditExchangeDialog } from "@/components/exchange-dialogs"
import { Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"

const ITEMS_PER_PAGE = 20

function StatsDisplay({ exchanges }: { exchanges: Exchange[] }) {
  const totalExchanges = exchanges.length
  const totalEmails = exchanges.reduce((acc, curr) => acc + curr.emails.length, 0)
  
  return (
    <div className="mt-4 mb-4">
      <h1 className="text-3xl font-bold">
        Rubrica Exchange
      </h1>
      <CardDescription>
        {totalExchanges} exchange, {totalEmails} email
      </CardDescription>
    </div>
  )
}

export function ExchangeList() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadExchanges = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/exchanges')
        const data = await response.json()
        setExchanges(data)
      } catch (error) {
        console.error('Errore nel caricamento degli exchange:', error)
      } finally {
        setLoading(false)
      }
    }
    loadExchanges()
  }, [])

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exchange.emails.some(email => email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredExchanges.length / ITEMS_PER_PAGE)
  const paginatedExchanges = filteredExchanges.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const toggleExchange = async (id: string) => {
    const exchange = exchanges.find(e => e.id === id)
    if (!exchange) return

    const response = await fetch(`/api/exchanges/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected: !exchange.selected })
    })

    if (response.ok) {
      setExchanges(exchanges.map(e =>
        e.id === id ? { ...e, selected: !e.selected } : e
      ))
    }
  }

  const toggleAllExchanges = async () => {
    const allSelected = paginatedExchanges.every(e => e.selected)
    const updates = paginatedExchanges.map(exchange => 
      fetch(`/api/exchanges/${exchange.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: !allSelected })
      })
    )

    await Promise.all(updates)
    setExchanges(exchanges.map(e => ({
      ...e,
      selected: paginatedExchanges.some(pe => pe.id === e.id) ? !allSelected : e.selected
    })))
  }

  const handleAddExchange = async (data: { name: string; emails: string[] }) => {
    const response = await fetch('/api/exchanges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const newExchange = await response.json()
      setExchanges([...exchanges, newExchange])
    }
  }

  const handleEditExchange = async (id: string, data: { name: string; emails: string[] }) => {
    const response = await fetch(`/api/exchanges/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const updatedExchange = await response.json()
      setExchanges(exchanges.map(e =>
        e.id === id ? updatedExchange : e
      ))
    }
  }

  const selectedExchanges = exchanges.filter(e => e.selected)

  const handleDeleteSelected = async () => {
    const deletePromises = selectedExchanges.map(exchange => 
      fetch(`/api/exchanges/${exchange.id}`, {
        method: 'DELETE'
      })
    )

    await Promise.all(deletePromises)
    setExchanges(exchanges.filter(e => !e.selected))
  }

  const handleDeleteExchange = async (id: string) => {
    const response = await fetch(`/api/exchanges/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      setExchanges(exchanges.filter(e => e.id !== id))
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] w-full space-y-4">
      <StatsDisplay exchanges={exchanges} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input 
            placeholder="Cerca..." 
            className="w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {selectedExchanges.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Elimina selezionati ({selectedExchanges.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Verranno eliminati {selectedExchanges.length} exchange e tutti i loro dati associati.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected}>
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <AddExchangeDialog onAdd={handleAddExchange} />
      </div>
      <Card>
        <CardContent className="px-4 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={paginatedExchanges.length > 0 && paginatedExchanges.every(e => e.selected)}
                    onCheckedChange={toggleAllExchanges}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedExchanges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nessun exchange trovato
                  </TableCell>
                </TableRow>
              ) : (
                paginatedExchanges.map((exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell>
                      <Checkbox 
                        checked={exchange.selected}
                        onCheckedChange={() => toggleExchange(exchange.id)}
                      />
                    </TableCell>
                    <TableCell>{exchange.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {exchange.emails.map((email, index) => (
                          <span key={index} className="text-sm text-muted-foreground">
                            {email}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EditExchangeDialog 
                          exchange={exchange}
                          onEdit={handleEditExchange}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questa azione non può essere annullata. Verrà eliminato l&apos;exchange {exchange.name} e tutti i suoi dati associati.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteExchange(exchange.id)}>
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(pageNum)}
              className="w-8 h-8"
            >
              {pageNum}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 