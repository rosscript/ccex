import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    // Aspettiamo che params sia risolto
    const { id } = await Promise.resolve(params)
    const exchange = db.updateExchange(id, data)

    if (!exchange) {
      return new NextResponse('Exchange non trovato', { status: 404 })
    }

    return NextResponse.json(exchange)
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'exchange:', error)
    return new NextResponse('Errore interno del server', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Aspettiamo che params sia risolto
    const { id } = await Promise.resolve(params)
    const success = db.deleteExchange(id)

    if (!success) {
      return new NextResponse('Exchange non trovato', { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'exchange:', error)
    return new NextResponse('Errore interno del server', { status: 500 })
  }
} 