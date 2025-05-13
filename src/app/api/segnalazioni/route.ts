import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const segnalazioni = db.getSegnalazioni()
  return NextResponse.json(segnalazioni)
}

export async function POST(request: Request) {
  const data = await request.json()
  const segnalazione = db.addSegnalazione(data)
  return NextResponse.json(segnalazione)
} 