import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/documentService';

export async function POST(request: NextRequest) {
  try {
    const { templateName, data } = await request.json();

    if (!templateName || !data) {
      return NextResponse.json(
        { error: 'Template name e data sono richiesti' },
        { status: 400 }
      );
    }

    const documentBuffer = await DocumentService.generateDocument(templateName, data);
    const uint8Array = new Uint8Array(documentBuffer);
    const blob = new Blob([uint8Array], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="documento_generato.docx"`,
      },
    });
  } catch (error) {
    console.error('Errore durante la generazione del documento:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione del documento' },
      { status: 500 }
    );
  }
} 