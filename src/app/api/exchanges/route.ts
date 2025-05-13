import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const exchanges = db.getExchanges()
  return NextResponse.json(exchanges)
}

export async function POST(request: Request) {
  const data = await request.json()
  const exchange = db.addExchange(data)
  return NextResponse.json(exchange)
} 