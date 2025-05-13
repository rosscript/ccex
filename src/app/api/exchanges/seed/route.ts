import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import exchanges from '@/data/exchanges.json'

export async function GET() {
  return NextResponse.json(
    { error: 'Questo endpoint accetta solo richieste POST' },
    { status: 405 }
  )
}

export async function POST() {
  try {
    // Pulisci il database degli exchange
    db.clearExchanges()
    
    // Carica tutti gli exchange dal file JSON
    for (const exchange of exchanges.exchanges) {
      await db.addExchange({
        id: exchange.id,
        name: exchange.name,
        emails: exchange.emails,
        selected: exchange.selected
      })
    }
    
    return NextResponse.json({ message: 'Exchange caricati con successo' })
  } catch (error) {
    console.error('Errore durante il caricamento degli exchange:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento degli exchange' },
      { status: 500 }
    )
  }
} 