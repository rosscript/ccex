import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Estendo jsPDF con i tipi per autotable
interface ExtendedJsPDF extends jsPDF {
  autotable: (options: Record<string, unknown>) => ExtendedJsPDF;
  lastAutoTable: {
    finalY: number;
  };
}

interface GeneratePdfParams {
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

export async function generatePdf({
  addresses,
  exchanges,
  documentBody,
  pointOfContact,
  pointOfContactDetails,
  activityNature,
  activityNatureLabel,
  signatureGroup,
  signatureGroupDetails
}: GeneratePdfParams): Promise<void> {
  // Crea un nuovo PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }) as ExtendedJsPDF;
  
  // Aggiungi logo o intestazione
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colori
  const primaryColor = [0, 51, 102]; // Blu scuro
  const accentColor = [153, 0, 0]; // Rosso scuro
  
  // Intestazione
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('COMANDO CARABINIERI ANTIFALSIFICAZIONE MONETARIA', pageWidth / 2, 12, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text('SEZIONE CRIPTOVALUTE', pageWidth / 2, 20, { align: 'center' });
  
  // Titolo documento
  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 30, pageWidth, 15, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.text('SEGNALAZIONE INDIRIZZI CRYPTO', pageWidth / 2, 40, { align: 'center' });
  
  // Data corrente
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: it });
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Roma, ${currentDate}`, pageWidth - 20, 50, { align: 'right' });
  
  // Corpo principale
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  let yPosition = 60;
  
  // Destinatari
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.text('Destinatari:', 20, yPosition);
  yPosition += 7;
  
  // Lista degli exchange
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  
  exchanges.forEach(exchange => {
    const exchangeText = `• ${exchange.name} (${exchange.emails.join(', ')})`;
    
    // Gestisci testo lungo
    const textLines = pdf.splitTextToSize(exchangeText, pageWidth - 40) as string[];
    textLines.forEach((line: string) => {
      pdf.text(line, 25, yPosition);
      yPosition += 5;
    });
  });
  
  yPosition += 5;
  
  // Corpo del documento
  pdf.setFontSize(11);
  const bodyLines = pdf.splitTextToSize(documentBody, pageWidth - 40) as string[];
  bodyLines.forEach((line: string) => {
    // Controlla se è necessario aggiungere una nuova pagina
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Indirizzi segnalati
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setFontSize(12);
  pdf.text('Indirizzi segnalati:', 20, yPosition);
  yPosition += 7;
  
  // Tabella degli indirizzi
  const tableData = addresses.map(addr => [addr.address, addr.blockchain.toUpperCase()]);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  // Imposta le opzioni per la tabella
  pdf.autotable({
    startY: yPosition,
    head: [['Indirizzo', 'Blockchain']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    margin: { left: 20, right: 20 },
    styles: { 
      fontSize: 9,
      overflow: 'linebreak',
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30 }
    }
  });
  
  // Aggiorna la posizione Y dopo la tabella
  yPosition = pdf.lastAutoTable.finalY + 15;
  
  // Se non c'è abbastanza spazio per i dettagli, aggiungi una nuova pagina
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // Point of Contact
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.setFontSize(12);
  pdf.text('Point of Contact:', 20, yPosition);
  yPosition += 7;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  
  if (pointOfContactDetails) {
    pdf.text(`${pointOfContactDetails.nominativo}${pointOfContactDetails.qualifica ? ` (${pointOfContactDetails.qualifica})` : ''}`, 25, yPosition);
    yPosition += 5;
    
    if (pointOfContactDetails.telefono) {
      pdf.text(`Telefono: ${pointOfContactDetails.telefono}`, 25, yPosition);
      yPosition += 5;
    }
    
    if (pointOfContactDetails.email) {
      pdf.text(`Email: ${pointOfContactDetails.email}`, 25, yPosition);
      yPosition += 5;
    }
    
    if (pointOfContactDetails.indirizzo) {
      pdf.text(`Indirizzo: ${pointOfContactDetails.indirizzo}`, 25, yPosition);
      yPosition += 5;
    }
  } else {
    pdf.text(pointOfContact, 25, yPosition);
    yPosition += 5;
  }
  
  yPosition += 5;
  
  // Natura dell'attività
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.text('Natura dell\'attività:', 20, yPosition);
  yPosition += 7;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.text(activityNatureLabel || activityNature, 25, yPosition);
  yPosition += 15;
  
  // Firma
  pdf.setFont('helvetica', 'bold');
  const firmaText = signatureGroupDetails 
    ? `${signatureGroupDetails.titolo} ${signatureGroupDetails.nome}` 
    : signatureGroup;
  pdf.text(firmaText, pageWidth - 20, yPosition, { align: 'right' });
  
  // Piè di pagina
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Documento generato automaticamente dal sistema CCEX', pageWidth / 2, pageHeight - 4, { align: 'center' });
  
  // Salva il PDF
  pdf.save('Segnalazione_Indirizzi_Crypto.pdf');
} 