import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

export interface DocumentData {
  [key: string]: string | number | boolean;
}

interface DocumentError extends Error {
  message: string;
  code?: string;
}

export class DocumentService {
  private static readonly TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates');

  static async generateDocument(templateName: string, data: DocumentData): Promise<Buffer> {
    try {
      // Leggi il template
      const templatePath = path.join(this.TEMPLATES_DIR, templateName);
      
      // Verifica che il file esista
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Il file template ${templateName} non esiste in ${this.TEMPLATES_DIR}`);
      }

      const content = fs.readFileSync(templatePath);
      
      // Verifica che il contenuto non sia vuoto
      if (!content || content.length === 0) {
        throw new Error('Il file template è vuoto');
      }

      try {
        // Crea un nuovo documento
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        // Sostituisci i placeholder con i dati
        doc.setData(data);

        // Genera il documento
        doc.render();

        // Ottieni il documento generato
        const output = doc.getZip().generate({
          type: 'nodebuffer',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        return output;
      } catch (error) {
        const docError = error as DocumentError;
        console.error('Errore durante la manipolazione del documento:', docError);
        throw new Error(`Errore durante la manipolazione del documento: ${docError.message}`);
      }
    } catch (error) {
      const docError = error as DocumentError;
      console.error('Errore durante la generazione del documento:', docError);
      throw new Error(`Impossibile generare il documento: ${docError.message}`);
    }
  }
} 