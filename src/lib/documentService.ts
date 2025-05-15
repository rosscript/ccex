export interface DocumentData {
  [key: string]: string | number | boolean | undefined;
  sign_title_first: string;
  sign_title_second: string;
  sign_name_surname: string;
}

interface DocumentError extends Error {
  message: string;
  code?: string;
}

export class DocumentService {
  async generateDocument(data: DocumentData): Promise<Response> {
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName: 'Awarness Letter.docx',
          data
        })
      });

      if (!response.ok) {
        throw new Error('Errore durante la generazione del documento');
      }

      return response;
    } catch (error) {
      const docError = error as DocumentError;
      console.error('Errore durante la generazione del documento:', docError);
      throw new Error(`Impossibile generare il documento: ${docError.message}`);
    }
  }
}

export const documentService = new DocumentService(); 