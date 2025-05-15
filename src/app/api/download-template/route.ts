import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'Awarness Letter.docx')
    
    // Verifica che il file esista
    try {
      await readFile(templatePath)
    } catch {
      return NextResponse.json(
        { error: 'Template non trovato' },
        { status: 404 }
      )
    }

    // Leggi il file
    const fileBuffer = await readFile(templatePath)

    // Converti il buffer in Uint8Array
    const uint8Array = new Uint8Array(fileBuffer)

    // Restituisci il file come risposta
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Awarness Letter.docx"',
      },
    })
  } catch (error) {
    console.error('Errore durante il download del template:', error)
    return NextResponse.json(
      { error: 'Errore durante il download del template' },
      { status: 500 }
    )
  }
} 