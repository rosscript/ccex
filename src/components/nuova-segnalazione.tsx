"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Loader2, X, RotateCcw, FileText, Send, Plus, ListPlus, CheckSquare, Square, Download } from "lucide-react"
import type { Exchange } from "@/lib/db"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DocumentData } from '@/lib/documentService';
import { documentService } from '@/lib/documentService';


export function NuovaSegnalazione() {
  const [cryptoAddresses, setCryptoAddresses] = useState<Array<{ address: string; blockchain: string }>>([])
  const [currentAddress, setCurrentAddress] = useState("")
  const [currentBlockchain, setCurrentBlockchain] = useState("bitcoin")
  const [bulkInput, setBulkInput] = useState("")
  const [bulkBlockchain, setBulkBlockchain] = useState("bitcoin")
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingExchanges, setUpdatingExchanges] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [documentBody, setDocumentBody] = useState("")
  const [pointOfContact, setPointOfContact] = useState("")
  const [activityNature, setActivityNature] = useState("")
  const [signatureGroup, setSignatureGroup] = useState("")
  
  const [pocOptions, setPocOptions] = useState<Array<{ value: string; label: string }>>([])
  const [activityOptions, setActivityOptions] = useState<Array<{ value: string; label: string }>>([])
  const [groupOptions, setGroupOptions] = useState<Array<{ value: string; label: string }>>([])

  type PointOfContact = {
    id: string;
    nominativo: string;
    qualifica: string;
    telefono: string;
    email: string;
    indirizzo: string;
  }

  type NaturaAttivita = {
    id: string;
    label: string;
  }

  type GruppoFirma = {
    id: string;
    titolo: string;
    nome: string;
    sign_title_first: string;
    sign_title_second: string;
    sign_name_surname: string;
  }

  const options = {
    pointOfContact: pocOptions,
    activityNature: activityOptions,
    signatureGroup: groupOptions
  }

  useEffect(() => {
    const loadExchanges = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/exchanges')
        const data = await response.json()
        const exchangesWithSelected = data.map((exchange: Exchange) => ({
          ...exchange,
          selected: true
        }))
        setExchanges(exchangesWithSelected)
      } catch (error) {
        console.error('Errore nel caricamento degli exchange:', error)
      } finally {
        setLoading(false)
      }
    }
    loadExchanges()
  }, [])

  useEffect(() => {
    const loadOptions = () => {
      const pocData = localStorage.getItem('pointsOfContact')
      const activitiesData = localStorage.getItem('activities')
      const groupsData = localStorage.getItem('signatureGroups')
      const defaultPocData = localStorage.getItem('defaultPoc')
      const defaultActivityData = localStorage.getItem('defaultActivity')
      const defaultGroupData = localStorage.getItem('defaultGroup')
      const defaultDocumentBodyData = localStorage.getItem('defaultDocumentBody')

      // Carica il corpo del documento predefinito
      if (defaultDocumentBodyData && !documentBody) {
        setDocumentBody(defaultDocumentBodyData)
      }

      // Carica le opzioni dal localStorage se disponibili, altrimenti utilizza i valori predefiniti
      if (pocData) {
        const parsedData = JSON.parse(pocData) as PointOfContact[];
        const newOptions = parsedData.map((poc: PointOfContact) => ({
          value: poc.id,
          label: `${poc.nominativo}${poc.qualifica ? ` (${poc.qualifica})` : ''}`
        }));
        setPocOptions(newOptions);
        
        // Imposta il valore predefinito se presente
        if (defaultPocData && !pointOfContact) {
          const defaultPoc = parsedData.find((poc: PointOfContact) => poc.id === defaultPocData);
          if (defaultPoc) {
            setPointOfContact(defaultPoc.id);
          }
        }
      }

      if (activitiesData) {
        const parsedData = JSON.parse(activitiesData) as NaturaAttivita[];
        const newOptions = parsedData.map((activity: NaturaAttivita) => ({
          value: activity.id,
          label: activity.label
        }));
        setActivityOptions(newOptions);
        
        // Imposta il valore predefinito se presente
        if (defaultActivityData && !activityNature) {
          const defaultActivity = parsedData.find((activity: NaturaAttivita) => activity.id === defaultActivityData);
          if (defaultActivity) {
            setActivityNature(defaultActivity.id);
          }
        }
      }

      if (groupsData) {
        const parsedData = JSON.parse(groupsData) as GruppoFirma[];
        const newOptions = parsedData.map((group: GruppoFirma) => ({
          value: group.id,
          label: `${group.titolo} ${group.nome}`
        }));
        setGroupOptions(newOptions);
        
        // Imposta il valore predefinito se presente
        if (defaultGroupData && !signatureGroup) {
          const defaultGroup = parsedData.find((group: GruppoFirma) => group.id === defaultGroupData);
          if (defaultGroup) {
            setSignatureGroup(defaultGroup.id);
          }
        }
      }
    }

    loadOptions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointOfContact, activityNature, signatureGroup])

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExchange = async (id: string) => {
    const exchange = exchanges.find(e => e.id === id)
    if (!exchange) return

    setUpdatingExchanges(true)
    try {
      const response = await fetch(`/api/exchanges/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected: !exchange.selected })
      })

      if (response.ok) {
        setExchanges(exchanges.map(e =>
          e.id === id ? { ...e, selected: !e.selected } : e
        ))
      }
    } finally {
      setUpdatingExchanges(false)
    }
  }

  const toggleAllExchanges = async () => {
    const allSelected = filteredExchanges.every(e => e.selected)
    setUpdatingExchanges(true)
    try {
      const updates = filteredExchanges.map(exchange => 
        fetch(`/api/exchanges/${exchange.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selected: !allSelected })
        })
      )

      await Promise.all(updates)
      setExchanges(exchanges.map(e => ({
        ...e,
        selected: filteredExchanges.some(fe => fe.id === e.id) ? !allSelected : e.selected
      })))
    } catch (error) {
      console.error('Errore durante l\'aggiornamento degli exchange:', error)
    } finally {
      setUpdatingExchanges(false)
    }
  }

  const handleAddAddress = () => {
    if (currentAddress.trim()) {
      setCryptoAddresses([...cryptoAddresses, { address: currentAddress.trim(), blockchain: currentBlockchain }])
      setCurrentAddress("")
    }
  }

  const handleRemoveAddress = (index: number) => {
    setCryptoAddresses(cryptoAddresses.filter((_, i) => i !== index))
  }

  const handleBulkImport = () => {
    // Regex per diversi tipi di indirizzi crypto
    const addressPatterns = {
      bitcoin: /(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}/g,
      ethereum: /0x[a-fA-F0-9]{40}/g,
      tron: /T[a-zA-Z0-9]{33}/g,
      solana: /[1-9A-HJ-NP-Za-km-z]{32,44}/g,
      cosmos: /cosmos[a-zA-Z0-9]{39}/g,
      polkadot: /1[a-zA-Z0-9]{47}/g,
      cardano: /addr1[a-zA-Z0-9]{98}/g,
      ripple: /r[a-zA-Z0-9]{24,34}/g,
      litecoin: /[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}/g,
      dogecoin: /D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}/g
    }

    const pattern = addressPatterns[bulkBlockchain as keyof typeof addressPatterns]
    if (!pattern) return

    const matches = bulkInput.match(pattern) || []
    const uniqueMatches = [...new Set(matches)]
    
    const newAddresses = uniqueMatches.map(address => ({
      address,
      blockchain: bulkBlockchain
    }))

    // Filtra gli indirizzi che non sono già presenti
    const existingAddresses = new Set(cryptoAddresses.map(a => a.address))
    const filteredNewAddresses = newAddresses.filter(a => !existingAddresses.has(a.address))

    setCryptoAddresses([...cryptoAddresses, ...filteredNewAddresses])
    setBulkInput("")
  }

  // Funzione di reset
  const handleReset = () => {
    setCryptoAddresses([])
    setCurrentAddress("")
    setBulkInput("")
    setExchanges(exchanges.map(e => ({ ...e, selected: true })))
  }

  const handleGenerateDocument = async () => {
    try {
      const groupsData = localStorage.getItem('signatureGroups');
      const pocData = localStorage.getItem('pointsOfContact');
      
      if (!groupsData) {
        throw new Error('Nessun gruppo firma configurato');
      }

      if (!pocData) {
        throw new Error('Nessun point of contact configurato');
      }

      const groups = JSON.parse(groupsData) as GruppoFirma[];
      const pocs = JSON.parse(pocData) as PointOfContact[];
      
      const selectedGroup = groups.find(g => g.id === signatureGroup);
      const selectedPoc = pocs.find(p => p.id === pointOfContact);
      
      if (!selectedGroup) {
        throw new Error('Nessun gruppo firma selezionato');
      }

      if (!selectedPoc) {
        throw new Error('Nessun point of contact selezionato');
      }

      // Raggruppa gli indirizzi per blockchain
      const addressesByBlockchain = cryptoAddresses.reduce((acc, addr) => {
        const blockchain = addr.blockchain.charAt(0).toUpperCase() + addr.blockchain.slice(1).toLowerCase();
        if (!acc[blockchain]) {
          acc[blockchain] = [];
        }
        acc[blockchain].push(addr.address);
        return acc;
      }, {} as Record<string, string[]>);

      // Formatta gli indirizzi come elenco puntato
      const formattedItems = Object.entries(addressesByBlockchain)
        .map(([blockchain, addresses]) => {
          const bulletPoints = addresses.map(addr => `• ${addr}`).join('\n');
          return `${blockchain}:\n${bulletPoints}`;
        })
        .join('\n\n');

      const data: DocumentData = {
        date: new Date().toLocaleDateString('it-IT'),
        recipients: filteredExchanges.map(e => `${e.name} (${e.emails.join(', ')})`).join(', '),
        body: documentBody,
        poc_name: selectedPoc.nominativo,
        poc_grade: selectedPoc.qualifica,
        poc_phone: selectedPoc.telefono,
        poc_email: selectedPoc.email,
        poc_address: selectedPoc.indirizzo,
        items: formattedItems,
        noa: activityOptions.find(a => a.value === activityNature)?.label || '',
        sign_title_first: selectedGroup.sign_title_first,
        sign_title_second: selectedGroup.sign_title_second,
        sign_name_surname: selectedGroup.sign_name_surname
      };

      const result = await documentService.generateDocument(data);

      // Scarica il documento
      const blob = await result.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Awarness Letter.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore nella generazione del documento:', error);
      alert('Si è verificato un errore durante la generazione del documento.');
    }
  }

  const formatAddress = (address: string) => {
    // Implementa la formattazione dell'indirizzo
    return address;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4">
      <h1 className="text-2xl font-semibold mb-6">Nuova Segnalazione</h1>
      <div className="grid grid-cols-[70%_30%] gap-6">
        <Card>
          <CardContent className="px-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Indirizzi e contratti ({cryptoAddresses.length})
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                    >
                      <ListPlus className="w-4 h-4" />
                      Bulk
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-[600px] h-[500px]">
                    <DialogHeader>
                      <DialogTitle>Importa indirizzi in bulk</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Select
                        value={bulkBlockchain}
                        onValueChange={setBulkBlockchain}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleziona blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          <SelectItem value="ethereum">Ethereum / EVM</SelectItem>
                          <SelectItem value="tron">Tron</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="cosmos">Cosmos</SelectItem>
                          <SelectItem value="polkadot">Polkadot</SelectItem>
                          <SelectItem value="cardano">Cardano</SelectItem>
                          <SelectItem value="ripple">Ripple</SelectItem>
                          <SelectItem value="litecoin">Litecoin</SelectItem>
                          <SelectItem value="dogecoin">Dogecoin</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <Textarea
                          placeholder="Incolla qui gli indirizzi..."
                          value={bulkInput}
                          onChange={(e) => setBulkInput(e.target.value)}
                          className="h-[260px] w-[550px] font-mono text-sm whitespace-pre overflow-auto resize-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <RotateCcw className="w-4 h-4" />
                            Annulla
                          </Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <Button onClick={handleBulkImport}>
                            <Download className="w-4 h-4" />
                            Importa
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Inserisci l'indirizzo"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                />
                <Select
                  value={currentBlockchain}
                  onValueChange={setCurrentBlockchain}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleziona blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="ethereum">Ethereum / EVM</SelectItem>
                    <SelectItem value="tron">Tron</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="cosmos">Cosmos</SelectItem>
                    <SelectItem value="polkadot">Polkadot</SelectItem>
                    <SelectItem value="cardano">Cardano</SelectItem>
                    <SelectItem value="ripple">Ripple</SelectItem>
                    <SelectItem value="litecoin">Litecoin</SelectItem>
                    <SelectItem value="dogecoin">Dogecoin</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddAddress}
                  disabled={!currentAddress.trim()}
                >
                  <Plus className="w-4 h-4" />
                  Aggiungi
                </Button>
              </div>

              <div className="h-[300px] overflow-y-auto">
                <ul className="space-y-2">
                  {cryptoAddresses.map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-accent/50"
                    >
                      <span className="text-sm flex-1 font-mono">
                        {formatAddress(item.address)} ({item.blockchain})
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 space-y-4">
            <div className="space-y-4 h-[400px] flex flex-col">
              <h2 className="text-lg font-semibold">
                Destinatari ({filteredExchanges.filter(e => e.selected).length} selezionati)
              </h2>
              <div className="flex items-center">
                <Input 
                  placeholder="Cerca exchange..." 
                  className="w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center flex-1">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {filteredExchanges.map((exchange) => (
                      <div 
                        key={exchange.id} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox 
                          checked={exchange.selected}
                          onCheckedChange={() => toggleExchange(exchange.id)}
                          disabled={updatingExchanges}
                        />
                        <span className="text-sm">{exchange.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAllExchanges}
                  disabled={updatingExchanges}
                >
                  {updatingExchanges ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    filteredExchanges.every(e => e.selected)
                      ? <CheckSquare className="h-4 w-4" />
                      : <Square className="h-4 w-4" />
                  )}
                  {filteredExchanges.every(e => e.selected) ? 'Deseleziona tutti' : 'Seleziona tutti'} ({filteredExchanges.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-6 space-y-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Corpo del Documento
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Inserisci il corpo del documento..."
                    value={documentBody}
                    onChange={(e) => setDocumentBody(e.target.value)}
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Card className="w-[400px]">
            <CardContent className="px-6 space-y-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Dettagli Aggiuntivi
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Point of Contact</label>
                    <Select
                      value={pointOfContact}
                      onValueChange={setPointOfContact}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona il point of contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.pointOfContact.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Natura dell&apos;Attività</label>
                    <Select
                      value={activityNature}
                      onValueChange={setActivityNature}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona la natura dell'attività" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.activityNature.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gruppo Firma</label>
                    <Select
                      value={signatureGroup}
                      onValueChange={setSignatureGroup}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona il gruppo firma" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button 
            variant="outline"
            disabled={cryptoAddresses.length === 0 || filteredExchanges.filter(e => e.selected).length === 0}
            onClick={handleGenerateDocument}
          >
            <FileText className="w-4 h-4" />
            Genera Documento
          </Button>
          <Button 
            disabled
          >
            <Send className="w-4 h-4" />
            Invia Segnalazione
          </Button>
        </div>
      </div>
    </div>
  )
} 