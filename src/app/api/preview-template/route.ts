import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import libre from 'libreoffice-convert'
import { promisify } from 'util'

const convertAsync = promisify(libre.convert)

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

    // Leggi il file Word
    const docxBuffer = await readFile(templatePath)

    // Converti il documento in PDF
    const pdfBuffer = await convertAsync(docxBuffer, '.pdf', undefined)

    // Converti il buffer in Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer)

    // Restituisci il PDF come risposta
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('Errore durante la conversione del template:', error)
    return NextResponse.json(
      { error: 'Errore durante la conversione del template' },
      { status: 500 }
    )
  }
} 