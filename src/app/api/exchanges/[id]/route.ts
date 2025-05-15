import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const data = await request.json()
    const { id } = await params
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
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