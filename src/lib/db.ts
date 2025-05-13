import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data')

// Assicurati che la directory data esista
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true })
}

export interface Exchange {
  id: string
  name: string
  emails: string[]
  selected: boolean
}

export interface Segnalazione {
  id: string
  indirizzi: string[]
  exchanges: string[]
  data: string
  stato: 'inviata' | 'in_attesa' | 'completata'
}

class Database {
  private exchanges: Exchange[] = []
  private segnalazioni: Segnalazione[] = []

  constructor() {
    this.loadData()
  }

  private loadData() {
    try {
      const exchangesPath = path.join(DB_PATH, 'exchanges.json')
      if (fs.existsSync(exchangesPath)) {
        this.exchanges = JSON.parse(fs.readFileSync(exchangesPath, 'utf-8'))
      }

      const segnalazioniPath = path.join(DB_PATH, 'segnalazioni.json')
      if (fs.existsSync(segnalazioniPath)) {
        this.segnalazioni = JSON.parse(fs.readFileSync(segnalazioniPath, 'utf-8'))
      }
    } catch (error) {
      console.error('Errore durante il caricamento dei dati:', error)
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(
        path.join(DB_PATH, 'exchanges.json'),
        JSON.stringify(this.exchanges, null, 2)
      )
      fs.writeFileSync(
        path.join(DB_PATH, 'segnalazioni.json'),
        JSON.stringify(this.segnalazioni, null, 2)
      )
    } catch (error) {
      console.error('Errore durante il salvataggio dei dati:', error)
    }
  }

  // Metodi per gli exchange
  getExchanges(): Exchange[] {
    return this.exchanges
  }

  clearExchanges(): void {
    this.exchanges = []
    this.saveData()
  }

  addExchange(exchange: Omit<Exchange, 'id'> & { id?: string }): Exchange {
    // Rimuovi eventuali exchange con lo stesso ID
    if (exchange.id) {
      this.exchanges = this.exchanges.filter(e => e.id !== exchange.id)
    }
    
    const newExchange = {
      ...exchange,
      id: exchange.id || Math.random().toString(36).substring(7)
    }
    this.exchanges.push(newExchange)
    this.saveData()
    return newExchange
  }

  updateExchange(id: string, data: Partial<Exchange>): Exchange | null {
    const index = this.exchanges.findIndex(e => e.id === id)
    if (index === -1) return null

    this.exchanges[index] = { ...this.exchanges[index], ...data }
    this.saveData()
    return this.exchanges[index]
  }

  deleteExchange(id: string): boolean {
    const index = this.exchanges.findIndex(e => e.id === id)
    if (index === -1) return false

    this.exchanges.splice(index, 1)
    this.saveData()
    return true
  }

  // Metodi per le segnalazioni
  getSegnalazioni(): Segnalazione[] {
    return this.segnalazioni
  }

  addSegnalazione(segnalazione: Omit<Segnalazione, 'id'>): Segnalazione {
    const newSegnalazione = {
      ...segnalazione,
      id: Math.random().toString(36).substring(7)
    }
    this.segnalazioni.push(newSegnalazione)
    this.saveData()
    return newSegnalazione
  }

  updateSegnalazione(id: string, data: Partial<Segnalazione>): Segnalazione | null {
    const index = this.segnalazioni.findIndex(s => s.id === id)
    if (index === -1) return null

    this.segnalazioni[index] = { ...this.segnalazioni[index], ...data }
    this.saveData()
    return this.segnalazioni[index]
  }
}

export const db = new Database() 