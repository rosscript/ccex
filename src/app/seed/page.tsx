'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSeed = async () => {
    try {
      const response = await fetch('/api/exchanges/seed', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message)
        setError('')
      } else {
        setError(data.error)
        setMessage('')
      }
    } catch (err) {
      setError('Errore durante la richiesta')
      setMessage('')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Carica Exchange</h1>
        
        <Button onClick={handleSeed} className="mb-4">
          Carica Exchange
        </Button>

        {message && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 