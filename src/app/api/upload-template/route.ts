import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('template') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nessun file fornito' },
        { status: 400 }
      )
    }

    // Verifica che il file sia un .docx
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Il file deve essere un documento Word (.docx)' },
        { status: 400 }
      )
    }

    // Converti il file in buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Salva il file nella cartella templates
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'Awarness Letter.docx')
    await writeFile(templatePath, buffer)

    return NextResponse.json({ message: 'Template caricato con successo' })
  } catch (error) {
    console.error('Errore durante l\'upload del template:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'upload del template' },
      { status: 500 }
    )
  }
} 