import { 
  Document, 
  Paragraph, 
  HeadingLevel, 
  Packer, 
  AlignmentType,
  SectionType,
  TextRun
} from 'docx';
import { saveAs } from 'file-saver';

interface GenerateDocumentParams {
  addresses: Array<{ address: string; blockchain: string }>;
  exchanges: Array<{ id: string; name: string; emails: string[]; }>;
  documentBody: string;
  pointOfContact: string;
  pointOfContactDetails?: { 
    nominativo: string;
    qualifica: string;
    telefono: string;
    email: string;
    indirizzo: string;
  };
  activityNature: string;
  activityNatureLabel?: string;
  signatureGroup: string;
  signatureGroupDetails?: {
    titolo: string;
    nome: string;
  };
}

export async function generateDocument({
  addresses,
  exchanges,
  documentBody,
  pointOfContact,
  pointOfContactDetails,
  activityNature,
  activityNatureLabel,
  signatureGroup,
  signatureGroupDetails
}: GenerateDocumentParams): Promise<void> {
  // Crea un nuovo documento
  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
      },
      children: [
        new Paragraph({
          text: "COMANDO CARABINIERI ANTIFALSIFICAZIONE MONETARIA",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          thematicBreak: true,
        }),
        new Paragraph({
          text: "SEZIONE CRIPTOVALUTE",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400, // Spazio dopo il paragrafo
          },
        }),
        new Paragraph({
          text: "SEGNALAZIONE INDIRIZZI CRYPTO",
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400, // Spazio dopo il paragrafo
          },
        }),
        
        // Data e luogo
        new Paragraph({
          text: `Roma, ${new Date().toLocaleDateString('it-IT')}`,
          alignment: AlignmentType.RIGHT,
          spacing: {
            after: 400, // Spazio dopo il paragrafo
          },
        }),
        
        // Destinatari
        new Paragraph({
          children: [
            new TextRun({
              text: "Destinatari:",
              bold: true,
            })
          ]
        }),
        
        // Lista degli exchange
        ...exchanges.map(exchange => new Paragraph({
          text: `${exchange.name} (${exchange.emails.join(', ')})`,
          bullet: {
            level: 0,
          },
        })),
        
        // Spazio
        new Paragraph({
          text: "",
          spacing: {
            after: 200,
          },
        }),
        
        // Corpo del documento
        new Paragraph({
          text: documentBody,
          spacing: {
            after: 400,
          },
        }),
        
        // Tabella degli indirizzi
        new Paragraph({
          children: [
            new TextRun({
              text: "Indirizzi segnalati:",
              bold: true,
            })
          ],
          spacing: {
            after: 200,
          },
        }),
        
        // Lista degli indirizzi
        ...addresses.map(addr => new Paragraph({
          text: `${addr.address} (${addr.blockchain.toUpperCase()})`,
          bullet: {
            level: 0,
          },
        })),
        
        // Spazio
        new Paragraph({
          text: "",
          spacing: {
            after: 400,
          },
        }),
        
        // Point of Contact
        new Paragraph({
          children: [
            new TextRun({
              text: "Point of Contact:",
              bold: true,
            })
          ]
        }),
        new Paragraph({
          text: pointOfContactDetails ? 
            `${pointOfContactDetails.nominativo}${pointOfContactDetails.qualifica ? ` (${pointOfContactDetails.qualifica})` : ''}` :
            pointOfContact,
          spacing: {
            after: 100,
          },
        }),
        
        // Se ci sono dettagli aggiuntivi per il point of contact
        ...(pointOfContactDetails ? [
          new Paragraph({
            text: `Telefono: ${pointOfContactDetails.telefono || 'N/A'}`,
          }),
          new Paragraph({
            text: `Email: ${pointOfContactDetails.email || 'N/A'}`,
          }),
          new Paragraph({
            text: `Indirizzo: ${pointOfContactDetails.indirizzo || 'N/A'}`,
            spacing: {
              after: 400,
            },
          }),
        ] : [new Paragraph({ text: "", spacing: { after: 400 } })]),
        
        // Natura dell'attività
        new Paragraph({
          children: [
            new TextRun({
              text: "Natura dell'attività:",
              bold: true,
            })
          ]
        }),
        new Paragraph({
          text: activityNatureLabel || activityNature,
          spacing: {
            after: 400,
          },
        }),
        
        // Firma
        new Paragraph({
          text: signatureGroupDetails ? 
            `${signatureGroupDetails.titolo} ${signatureGroupDetails.nome}` :
            signatureGroup,
          alignment: AlignmentType.RIGHT,
          spacing: {
            before: 800,
          },
        }),
      ],
    }],
  });

  // Genera il documento e salvalo
  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, "Segnalazione_Indirizzi_Crypto.docx");
} 