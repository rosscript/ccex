import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface GeneratePdfParams {
  addresses: Array<{ address: string; blockchain: string }>;
  exchanges: Array<{ id: string; name: string; emails: string[]; }>;
  documentBody: string;
  pointOfContact: string;
  pointOfContactDetails?: { 
    name?: string;
    position?: string;
    phone?: string;
    email?: string;
    address?: string;
    nominativo?: string;
    qualifica?: string;
    telefono?: string;
    indirizzo?: string;
  };
  activityNature: string;
  activityNatureLabel?: string;
  signatureGroup: string;
  signatureGroupDetails?: {
    title?: string;
    name?: string;
    titolo?: string;
    nome?: string;
  };
  headerImageBase64?: string; // Aggiunto parametro per l'immagine in base64
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
  signatureGroupDetails,
  headerImageBase64
}: GeneratePdfParams): Promise<void> {
  // Create a new PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add logo or header
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [70, 70, 70]; // Gray instead of dark blue
  
  let yPosition = 20; // Posizione iniziale
  
  // Usando l'immagine come intestazione
  if (headerImageBase64) {
    try {
      // Dimensioni e posizionamento dell'immagine
      const imgWidth = 180; // Larghezza dell'immagine in mm
      const imgHeight = 40; // Altezza dell'immagine in mm (approssimativa, verrà mantenuto l'aspect ratio)
      
      // Centra l'immagine
      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = yPosition;
      
      // Carica l'immagine da URL
      const img = new Image();
      img.src = headerImageBase64;
      
      // Aspetta che l'immagine sia caricata
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      pdf.addImage(
        img,
        'PNG',
        xPos,
        yPos,
        imgWidth,
        imgHeight
      );
      
      // Documento inizia dopo l'immagine
      yPosition = yPos + imgHeight + 15;
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
      // In caso di errore, continua con l'intestazione testuale (gestita dopo l'if)
    }
  }
  
  if (!headerImageBase64 || yPosition === 20) {
    // Fallback al titolo testuale o se è stata richiesta l'intestazione testuale
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('Times New Roman', 'bold');
    pdf.setFontSize(20);
    pdf.text('Comando Carabinieri Antifalsificazione Monetaria', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.text('Sezione Criptovalute', pageWidth / 2, 38, { align: 'center' });
    
    yPosition = 55;
  }
  
  // Document title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.text('CRYPTO ADDRESSES ALERT REPORT', pageWidth / 2, yPosition, { align: 'center' });
  
  // Current date
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: enUS });
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Rome, ${currentDate}`, pageWidth - 20, yPosition + 10, { align: 'right' });
  
  // Main body
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  yPosition += 20;
  
  // Recipients
  pdf.setFont('Times New Roman', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Recipients:', 20, yPosition);
  yPosition += 7;
  
  // Recipients as comma-separated list instead of bullet points
  pdf.setFont('Times New Roman', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  
  // Create a single comma-separated string of recipients
  const exchangesList = exchanges.map(exchange => 
    `${exchange.name} (${exchange.emails.join(', ')})`
  ).join(', ');
  
  // Handle long text by wrapping
  const textLines = pdf.splitTextToSize(exchangesList, pageWidth - 40) as string[];
  textLines.forEach((line: string) => {
    pdf.text(line, 25, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // Document body
  pdf.setFontSize(11);
  const bodyLines = pdf.splitTextToSize(documentBody, pageWidth - 40) as string[];
  bodyLines.forEach((line: string) => {
    // Check if a new page is needed
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.text(line, 20, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Reported addresses
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.setFont('Times New Roman', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text('Reported Addresses:', 20, yPosition);
  yPosition += 7;
  
  // Tabella per gli indirizzi
  pdf.setFont('Times New Roman', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  
  // Definizione larghezza colonne
  const addressColWidth = pageWidth - 70;
  const blockchainColWidth = 30;
  
  // Intestazione tabella
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
  pdf.setFont('Times New Roman', 'bold');
  pdf.text('Address', 25, yPosition + 5);
  pdf.text('Blockchain', pageWidth - blockchainColWidth - 15, yPosition + 5);
  yPosition += 7;
  
  // Righe della tabella
  addresses.forEach((addr, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
    }
    
    // Check if a new page is needed
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
      
      // Reimpostazione intestazione tabella nella nuova pagina
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
      pdf.setFont('Times New Roman', 'bold');
      pdf.text('Address', 25, yPosition + 5);
      pdf.text('Blockchain', pageWidth - blockchainColWidth - 15, yPosition + 5);
      yPosition += 7;
    }
    
    pdf.setFont('Times New Roman', 'normal');
    
    // Tronca l'indirizzo se troppo lungo e assicura che non sfori
    const address = addr.address;
    const truncatedAddress = pdf.splitTextToSize(address, addressColWidth - 5)[0];
    const displayAddress = truncatedAddress.length < address.length ? 
                          truncatedAddress.substring(0, truncatedAddress.length - 3) + '...' : 
                          truncatedAddress;
    
    pdf.text(displayAddress, 25, yPosition + 5);
    pdf.text(addr.blockchain.toUpperCase(), pageWidth - blockchainColWidth - 15, yPosition + 5);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // If there's not enough space for details, add a new page
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // Point of Contact
  pdf.setFont('Times New Roman', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text('Point of Contact:', 20, yPosition);
  yPosition += 7;
  
  // Tabella per il point of contact
  if (pointOfContactDetails) {
    // Supporto sia per i campi in italiano che per quelli in inglese
    const nominativo = pointOfContactDetails.name || pointOfContactDetails.nominativo || '';
    const qualifica = pointOfContactDetails.position || pointOfContactDetails.qualifica || '';
    const telefono = pointOfContactDetails.phone || pointOfContactDetails.telefono || '';
    const email = pointOfContactDetails.email || '';
    const indirizzo = pointOfContactDetails.address || pointOfContactDetails.indirizzo || '';
    
    // Larghezza colonne
    const infoColWidth = 40;
    const detailsColWidth = pageWidth - 60;
    
    // Intestazione tabella POC
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
    pdf.setFont('Times New Roman', 'bold');
    pdf.setFontSize(9);
    pdf.text('Information', 25, yPosition + 5);
    pdf.text('Details', 25 + infoColWidth, yPosition + 5);
    yPosition += 7;
    
    // Righe della tabella POC
    pdf.setFont('Times New Roman', 'bold');
    pdf.setFillColor(250, 250, 250);
    pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
    pdf.text('Name', 25, yPosition + 5);
    
    pdf.setFont('Times New Roman', 'normal');
    // Gestione testo lungo per il nome
    const nameText = `${nominativo}${qualifica ? ` (${qualifica})` : ''}`;
    const nameLines = pdf.splitTextToSize(nameText, detailsColWidth) as string[];
    pdf.text(nameLines[0], 25 + infoColWidth, yPosition + 5);
    
    // Se il testo è più lungo, aggiungi più righe
    if (nameLines.length > 1) {
      let extraHeight = 0;
      for (let i = 1; i < nameLines.length; i++) {
        extraHeight += 5;
        pdf.text(nameLines[i], 25 + infoColWidth, yPosition + 5 + extraHeight);
      }
      // Estendi la riga della tabella
      pdf.rect(20, yPosition, pageWidth - 40, 7 + extraHeight, 'F');
      yPosition += extraHeight;
    }
    
    yPosition += 7;
    
    if (telefono) {
      pdf.setFont('Times New Roman', 'bold');
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
      pdf.text('Phone', 25, yPosition + 5);
      
      pdf.setFont('Times New Roman', 'normal');
      // Gestione testo lungo per il telefono
      const phoneLines = pdf.splitTextToSize(telefono, detailsColWidth) as string[];
      pdf.text(phoneLines[0], 25 + infoColWidth, yPosition + 5);
      
      // Se il testo è più lungo, aggiungi più righe
      if (phoneLines.length > 1) {
        let extraHeight = 0;
        for (let i = 1; i < phoneLines.length; i++) {
          extraHeight += 5;
          pdf.text(phoneLines[i], 25 + infoColWidth, yPosition + 5 + extraHeight);
        }
        // Estendi la riga della tabella
        pdf.rect(20, yPosition, pageWidth - 40, 7 + extraHeight, 'F');
        yPosition += extraHeight;
      }
      
      yPosition += 7;
    }
    
    if (email) {
      pdf.setFont('Times New Roman', 'bold');
      pdf.setFillColor(250, 250, 250);
      pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
      pdf.text('Email', 25, yPosition + 5);
      
      pdf.setFont('Times New Roman', 'normal');
      // Gestione testo lungo per l'email
      const emailLines = pdf.splitTextToSize(email, detailsColWidth) as string[];
      pdf.text(emailLines[0], 25 + infoColWidth, yPosition + 5);
      
      // Se il testo è più lungo, aggiungi più righe
      if (emailLines.length > 1) {
        let extraHeight = 0;
        for (let i = 1; i < emailLines.length; i++) {
          extraHeight += 5;
          pdf.text(emailLines[i], 25 + infoColWidth, yPosition + 5 + extraHeight);
        }
        // Estendi la riga della tabella
        pdf.rect(20, yPosition, pageWidth - 40, 7 + extraHeight, 'F');
        yPosition += extraHeight;
      }
      
      yPosition += 7;
    }
    
    if (indirizzo) {
      pdf.setFont('Times New Roman', 'bold');
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
      pdf.text('Address', 25, yPosition + 5);
      
      pdf.setFont('Times New Roman', 'normal');
      // Gestione testo lungo per l'indirizzo
      const addressLines = pdf.splitTextToSize(indirizzo, detailsColWidth) as string[];
      
      // Prima riga
      pdf.text(addressLines[0], 25 + infoColWidth, yPosition + 5);
      
      // Righe aggiuntive
      if (addressLines.length > 1) {
        let extraHeight = 0;
        for (let i = 1; i < addressLines.length; i++) {
          extraHeight += 5;
          pdf.text(addressLines[i], 25 + infoColWidth, yPosition + 5 + extraHeight);
        }
        // Estendi la riga della tabella
        pdf.rect(20, yPosition, pageWidth - 40, 7 + extraHeight, 'F');
        yPosition += extraHeight;
      }
      
      yPosition += 7;
    }
  } else {
    pdf.setFont('Times New Roman', 'normal');
    pdf.text(pointOfContact, 25, yPosition);
    yPosition += 5;
  }
  
  yPosition += 10;
  
  // Nature of activity
  pdf.setFont('Times New Roman', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text('Nature of Activity:', 20, yPosition);
  yPosition += 7;
  
  // Tabella per natura dell'attività
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
  pdf.setFont('Times New Roman', 'bold');
  pdf.setFontSize(9);
  pdf.text('Activity Type', 25, yPosition + 5);
  yPosition += 7;
  
  pdf.setFillColor(250, 250, 250);
  pdf.rect(20, yPosition, pageWidth - 40, 7, 'F');
  pdf.setFont('Times New Roman', 'normal');
  
  // Gestione testo lungo per la natura dell'attività
  const activityText = activityNatureLabel || activityNature;
  const activityLines = pdf.splitTextToSize(activityText, pageWidth - 50) as string[];
  pdf.text(activityLines[0], 25, yPosition + 5);
  
  // Se il testo è più lungo, aggiungi più righe
  if (activityLines.length > 1) {
    let extraHeight = 0;
    for (let i = 1; i < activityLines.length; i++) {
      extraHeight += 5;
      pdf.text(activityLines[i], 25, yPosition + 5 + extraHeight);
    }
    // Estendi la riga della tabella
    pdf.rect(20, yPosition, pageWidth - 40, 7 + extraHeight, 'F');
    yPosition += extraHeight;
  }
  
  yPosition += 30;
  
  // Signature
  pdf.setFont('Times New Roman', 'bold');
  pdf.setFontSize(11);
  
  if (signatureGroupDetails) {
    const title = signatureGroupDetails.title || signatureGroupDetails.titolo || '';
    const name = signatureGroupDetails.name || signatureGroupDetails.nome || '';
    
    // Firma posizionata più in basso
    yPosition = pageHeight - 60;
    
    // Invertiti: prima il titolo, poi il nome
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    
    pdf.setFont('Times New Roman', 'normal');
    pdf.text(name, pageWidth / 2, yPosition, { align: 'center' });
  } else {
    // Firma posizionata più in basso
    yPosition = pageHeight - 60;
    pdf.text(signatureGroup, pageWidth / 2, yPosition, { align: 'center' });
  }
  
  // Footer
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  pdf.setFont('Times New Roman', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Document automatically generated by CCEX system', pageWidth / 2, pageHeight - 4, { align: 'center' });
  
  // Save PDF
  pdf.save('Crypto_Addresses_Report.pdf');
} 