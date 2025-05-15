import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { templateName, data } = await request.json();

    if (!templateName || !data) {
      return NextResponse.json(
        { error: 'Template name e data sono richiesti' },
        { status: 400 }
      );
    }

    // Leggi il template
    const templatePath = path.join(process.cwd(), 'public', 'templates', templateName);
    
    // Verifica che il file esista
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: `Il file template ${templateName} non esiste` },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(templatePath);
    
    // Verifica che il contenuto non sia vuoto
    if (!content || content.length === 0) {
      return NextResponse.json(
        { error: 'Il file template è vuoto' },
        { status: 400 }
      );
    }

    try {
      // Crea un nuovo documento
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Genera il documento con i dati
      doc.render(data);

      // Ottieni il documento generato
      const output = doc.getZip().generate({
        type: 'nodebuffer',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Converti il buffer in Uint8Array
      const uint8Array = new Uint8Array(output);

      // Restituisci il documento come risposta
      return new NextResponse(uint8Array, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${templateName}"`,
        },
      });
    } catch (error) {
      console.error('Errore durante la manipolazione del documento:', error);
      return NextResponse.json(
        { error: 'Errore durante la manipolazione del documento' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Errore durante la generazione del documento:', error);
    return NextResponse.json(
      { error: 'Impossibile generare il documento' },
      { status: 500 }
    );
  }
} 