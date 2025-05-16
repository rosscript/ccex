"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { PageTransition } from "@/components/page-transition"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Save, Download } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("poc")
  const [pointsOfContact, setPointsOfContact] = useState<PointOfContact[]>([])
  const [activities, setActivities] = useState<NaturaAttivita[]>([])
  const [signatureGroups, setSignatureGroups] = useState<GruppoFirma[]>([])
  const [defaultDocumentBody, setDefaultDocumentBody] = useState("")
  const [currentTemplateName, setCurrentTemplateName] = useState<string | null>(null)
  
  const [defaultPoc, setDefaultPoc] = useState<string | null>(null)
  const [defaultActivity, setDefaultActivity] = useState<string | null>(null)
  const [defaultGroup, setDefaultGroup] = useState<string | null>(null)
  
  // Point of Contact inputs
  const [newNominativo, setNewNominativo] = useState("")
  const [newQualifica, setNewQualifica] = useState("")
  const [newTelefono, setNewTelefono] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newIndirizzo, setNewIndirizzo] = useState("")
  
  // Natura Attività inputs
  const [newActivityLabel, setNewActivityLabel] = useState("")
  
  // Gruppo Firma inputs
  const [newTitolo, setNewTitolo] = useState("")
  const [newNome, setNewNome] = useState("")
  const [newSignTitleFirst, setNewSignTitleFirst] = useState("")
  const [newSignTitleSecond, setNewSignTitleSecond] = useState("")
  const [newSignNameSurname, setNewSignNameSurname] = useState("")

  useEffect(() => {
    // Funzione per inizializzare i dati di default
    const initializeDefaultData = () => {
      const defaultPointsOfContact = [
        {
          id: "5bytfk0",
          nominativo: "Major Simone Vecchiarello",
          qualifica: "Commander of the Carabinieri's Cryptocurrencies Section",
          telefono: "+39 064450391",
          email: "ccafmsc@carabinieri.it",
          indirizzo: "Via Varese nr. 9, 00185 Rome, Italy"
        }
      ]

      const defaultActivities = [
        {
          id: "z2ckgdb",
          label: "Physical theft of cryptocurrencies"
        }
      ]

      const defaultSignatureGroups = [
        {
          id: "5xsehs8",
          titolo: "THE CHIEF OF CRYPTOCURRENCIES SECTION",
          nome: "Simone Vecchiarello",
          sign_title_first: "THE CHIEF OF",
          sign_title_second: "CRYPTOCURRENCIES SECTION",
          sign_name_surname: "(Simone Vecchiarello)"
        }
      ]

      const defaultDocumentBodyText = `Subject: Notification of Illicit Activity Involving Specific Address or Transaction

We have recently identified a suspicious cryptocurrency address or transaction involving illegal activity of __________________.

As part of our commitment to ensuring the integrity of the financial system and preventing any crime committed or attempted throughout the use of the Blockchain, we are issuing this notification to alert your platform and request immediate attention to this matter.

We're not asking you to take any action, nor are we asking you to pass this information on to the potential customer, we're simply giving you this relevant information so that you can decide whether you want to tackle a potential threat and money laundering activity.

Furthermore, if you identify any transactions associated to the communicated address, we'd like to ask you to provide us immediately any relevant information about the ownership of the wallets, in particular if the wallet mentioned above does interact with your platform.

The details are specified in the tab below:`

      // Inizializza i dati solo se non esistono già nel localStorage
      if (!localStorage.getItem('pointsOfContact')) {
        saveToLocalStorage('pointsOfContact', defaultPointsOfContact)
        setPointsOfContact(defaultPointsOfContact)
        localStorage.setItem('defaultPoc', defaultPointsOfContact[0].id)
        setDefaultPoc(defaultPointsOfContact[0].id)
      }

      if (!localStorage.getItem('activities')) {
        saveToLocalStorage('activities', defaultActivities)
        setActivities(defaultActivities)
        localStorage.setItem('defaultActivity', defaultActivities[0].id)
        setDefaultActivity(defaultActivities[0].id)
      }

      if (!localStorage.getItem('signatureGroups')) {
        saveToLocalStorage('signatureGroups', defaultSignatureGroups)
        setSignatureGroups(defaultSignatureGroups)
        localStorage.setItem('defaultGroup', defaultSignatureGroups[0].id)
        setDefaultGroup(defaultSignatureGroups[0].id)
      }

      if (!localStorage.getItem('defaultDocumentBody')) {
        localStorage.setItem('defaultDocumentBody', defaultDocumentBodyText)
        setDefaultDocumentBody(defaultDocumentBodyText)
      }

      if (!localStorage.getItem('currentTemplateName')) {
        localStorage.setItem('currentTemplateName', 'Awarness Letter.docx')
        setCurrentTemplateName('Awarness Letter.docx')
      }
    }

    // Carica i dati salvati dal local storage
    const loadSettings = () => {
      const pocData = localStorage.getItem('pointsOfContact')
      const activitiesData = localStorage.getItem('activities')
      const groupsData = localStorage.getItem('signatureGroups')
      const defaultPocData = localStorage.getItem('defaultPoc')
      const defaultActivityData = localStorage.getItem('defaultActivity')
      const defaultGroupData = localStorage.getItem('defaultGroup')
      const documentBodyData = localStorage.getItem('defaultDocumentBody')
      const templateName = localStorage.getItem('currentTemplateName')

      if (pocData) setPointsOfContact(JSON.parse(pocData))
      if (activitiesData) setActivities(JSON.parse(activitiesData))
      if (groupsData) setSignatureGroups(JSON.parse(groupsData))
      if (defaultPocData) setDefaultPoc(defaultPocData)
      if (defaultActivityData) setDefaultActivity(defaultActivityData)
      if (defaultGroupData) setDefaultGroup(defaultGroupData)
      if (documentBodyData) setDefaultDocumentBody(documentBodyData)
      if (templateName) setCurrentTemplateName(templateName)
    }

    // Inizializza i dati di default e poi carica le impostazioni
    initializeDefaultData()
    loadSettings()
  }, [])

  const saveToLocalStorage = <T,>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9)
  }

  const handleSetDefaultPoc = (id: string) => {
    setDefaultPoc(id)
    localStorage.setItem('defaultPoc', id)
  }

  const handleSetDefaultActivity = (id: string) => {
    setDefaultActivity(id)
    localStorage.setItem('defaultActivity', id)
  }

  const handleSetDefaultGroup = (id: string) => {
    setDefaultGroup(id)
    localStorage.setItem('defaultGroup', id)
  }

  const handleAddPoc = () => {
    if (newNominativo.trim()) {
      const newPoc: PointOfContact = {
        id: generateId(),
        nominativo: newNominativo.trim(),
        qualifica: newQualifica.trim(),
        telefono: newTelefono.trim(),
        email: newEmail.trim(),
        indirizzo: newIndirizzo.trim()
      }
      
      const newData = [...pointsOfContact, newPoc]
      setPointsOfContact(newData)
      saveToLocalStorage('pointsOfContact', newData)
      
      // Se è il primo elemento, impostalo come default
      if (newData.length === 1 && !defaultPoc) {
        handleSetDefaultPoc(newPoc.id)
      }
      
      // Reset dei campi
      setNewNominativo("")
      setNewQualifica("")
      setNewTelefono("")
      setNewEmail("")
      setNewIndirizzo("")
    }
  }

  const handleAddActivity = () => {
    if (newActivityLabel.trim()) {
      const newActivity: NaturaAttivita = {
        id: generateId(),
        label: newActivityLabel.trim()
      }
      
      const newData = [...activities, newActivity]
      setActivities(newData)
      saveToLocalStorage('activities', newData)
      
      // Se è il primo elemento, impostalo come default
      if (newData.length === 1 && !defaultActivity) {
        handleSetDefaultActivity(newActivity.id)
      }
      
      setNewActivityLabel("")
    }
  }

  const handleAddGroup = () => {
    if (newTitolo.trim() && newNome.trim()) {
      const newGroup: GruppoFirma = {
        id: generateId(),
        titolo: newTitolo.trim(),
        nome: newNome.trim(),
        sign_title_first: newSignTitleFirst.trim(),
        sign_title_second: newSignTitleSecond.trim(),
        sign_name_surname: newSignNameSurname.trim()
      }
      
      const newData = [...signatureGroups, newGroup]
      setSignatureGroups(newData)
      saveToLocalStorage('signatureGroups', newData)
      
      // Se è il primo elemento, impostalo come default
      if (newData.length === 1 && !defaultGroup) {
        handleSetDefaultGroup(newGroup.id)
      }
      
      setNewTitolo("")
      setNewNome("")
      setNewSignTitleFirst("")
      setNewSignTitleSecond("")
      setNewSignNameSurname("")
    }
  }

  const handleRemovePoc = (id: string) => {
    const newData = pointsOfContact.filter(poc => poc.id !== id)
    setPointsOfContact(newData)
    saveToLocalStorage('pointsOfContact', newData)
    
    // Se l'elemento rimosso era il default, resetta il default
    if (defaultPoc === id) {
      if (newData.length > 0) {
        handleSetDefaultPoc(newData[0].id)
      } else {
        setDefaultPoc(null)
        localStorage.removeItem('defaultPoc')
      }
    }
  }

  const handleRemoveActivity = (id: string) => {
    const newData = activities.filter(activity => activity.id !== id)
    setActivities(newData)
    saveToLocalStorage('activities', newData)
    
    // Se l'elemento rimosso era il default, resetta il default
    if (defaultActivity === id) {
      if (newData.length > 0) {
        handleSetDefaultActivity(newData[0].id)
      } else {
        setDefaultActivity(null)
        localStorage.removeItem('defaultActivity')
      }
    }
  }

  const handleRemoveGroup = (id: string) => {
    const newData = signatureGroups.filter(group => group.id !== id)
    setSignatureGroups(newData)
    saveToLocalStorage('signatureGroups', newData)
    
    // Se l'elemento rimosso era il default, resetta il default
    if (defaultGroup === id) {
      if (newData.length > 0) {
        handleSetDefaultGroup(newData[0].id)
      } else {
        setDefaultGroup(null)
        localStorage.removeItem('defaultGroup')
      }
    }
  }

  const handleSaveDocumentBody = () => {
    localStorage.setItem('defaultDocumentBody', defaultDocumentBody)
    alert('Corpo del documento salvato con successo!')
  }

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Crea un FormData per l'upload
      const formData = new FormData()
      formData.append('template', file)
      
      try {
        const response = await fetch('/api/upload-template', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Errore durante l\'upload del template')
        }
        
        // Aggiorna il nome del template nel localStorage e nello state
        localStorage.setItem('currentTemplateName', file.name)
        setCurrentTemplateName(file.name)
      } catch (error) {
        console.error('Errore durante l\'upload del template:', error)
        alert('Si è verificato un errore durante l\'upload del template')
      }
    } else {
      alert('Per favore seleziona un file Word valido (.docx)')
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/download-template')
      if (!response.ok) {
        throw new Error('Errore durante il download del template')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = currentTemplateName || 'Awarness Letter.docx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Errore durante il download del template:', error)
      alert('Si è verificato un errore durante il download del template')
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <PageTransition>
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <div className="mx-auto max-w-[1400px] w-full">
                  <h1 className="text-2xl font-semibold mb-6">Impostazioni Account</h1>
                  
                  <Tabs defaultValue="poc" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="poc">Point of Contact</TabsTrigger>
                      <TabsTrigger value="activities">Natura delle Attività</TabsTrigger>
                      <TabsTrigger value="groups">Gruppi Firma</TabsTrigger>
                      <TabsTrigger value="document">Corpo del Documento</TabsTrigger>
                      <TabsTrigger value="template">Template Word</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="poc">
                      <Card>
                        <CardHeader>
                          <CardTitle>Point of Contact</CardTitle>
                          <CardDescription>
                            Gestisci i point of contact disponibili nelle segnalazioni
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="nominativo">Nominativo</Label>
                                <Input
                                  id="nominativo"
                                  placeholder="Nominativo"
                                  value={newNominativo}
                                  onChange={(e) => setNewNominativo(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="qualifica">Qualifica</Label>
                                <Input
                                  id="qualifica"
                                  placeholder="Qualifica"
                                  value={newQualifica}
                                  onChange={(e) => setNewQualifica(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="telefono">Telefono</Label>
                                <Input
                                  id="telefono"
                                  placeholder="Telefono"
                                  value={newTelefono}
                                  onChange={(e) => setNewTelefono(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="E-mail"
                                  value={newEmail}
                                  onChange={(e) => setNewEmail(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="indirizzo">Indirizzo</Label>
                                <Input
                                  id="indirizzo"
                                  placeholder="Indirizzo"
                                  value={newIndirizzo}
                                  onChange={(e) => setNewIndirizzo(e.target.value)}
                                />
                              </div>
                              
                              <div className="sm:col-span-2 flex justify-end">
                                <Button onClick={handleAddPoc} disabled={!newNominativo.trim()}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Aggiungi Point of Contact
                                </Button>
                              </div>
                            </div>
                            
                            <div className="rounded-md border">
                              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 font-medium border-b">
                                <div>Points of Contact</div>
                              </div>
                              {pointsOfContact.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                  Nessun point of contact configurato
                                </div>
                              ) : (
                                <RadioGroup 
                                  value={defaultPoc || ""} 
                                  onValueChange={handleSetDefaultPoc}
                                >
                                  {pointsOfContact.map((poc) => (
                                    <div key={poc.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 items-center border-b last:border-b-0">
                                      <RadioGroupItem value={poc.id} id={`poc-${poc.id}`} />
                                      <div>
                                        <div className="font-medium">{poc.nominativo}</div>
                                        <div className="text-sm text-muted-foreground">{poc.qualifica}</div>
                                        <div className="text-sm text-muted-foreground">{poc.indirizzo}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm">{poc.telefono}</div>
                                        <div className="text-sm">{poc.email}</div>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleRemovePoc(poc.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="activities">
                      <Card>
                        <CardHeader>
                          <CardTitle>Natura delle Attività</CardTitle>
                          <CardDescription>
                            Gestisci le tipologie di attività disponibili nelle segnalazioni
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="flex flex-col gap-4 sm:flex-row">
                              <div className="flex-1">
                                <Input
                                  placeholder="Natura dell'attività (es. Attività Investigativa)"
                                  value={newActivityLabel}
                                  onChange={(e) => setNewActivityLabel(e.target.value)}
                                />
                              </div>
                              <Button onClick={handleAddActivity} disabled={!newActivityLabel.trim()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Aggiungi
                              </Button>
                            </div>
                            
                            <div className="rounded-md border">
                              <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 font-medium border-b">
                                <div>Elenco</div>
                              </div>
                              {activities.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                  Nessuna natura di attività configurata
                                </div>
                              ) : (
                                <RadioGroup 
                                  value={defaultActivity || ""} 
                                  onValueChange={handleSetDefaultActivity}
                                >
                                  {activities.map((activity) => (
                                    <div key={activity.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center border-b last:border-b-0">
                                      <RadioGroupItem value={activity.id} id={`activity-${activity.id}`} />
                                      <div>{activity.label}</div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleRemoveActivity(activity.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </RadioGroup>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="groups">
                      <Card>
                        <CardHeader>
                          <CardTitle>Gruppi Firma</CardTitle>
                          <CardDescription>
                            Gestisci i gruppi firma per i documenti
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="newTitolo">Titolo</Label>
                                <Input
                                  id="newTitolo"
                                  value={newTitolo}
                                  onChange={(e) => setNewTitolo(e.target.value)}
                                  placeholder="Inserisci il titolo"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newNome">Nome</Label>
                                <Input
                                  id="newNome"
                                  value={newNome}
                                  onChange={(e) => setNewNome(e.target.value)}
                                  placeholder="Inserisci il nome"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newSignTitleFirst">Titolo Firma 1</Label>
                                <Input
                                  id="newSignTitleFirst"
                                  value={newSignTitleFirst}
                                  onChange={(e) => setNewSignTitleFirst(e.target.value)}
                                  placeholder="Inserisci il primo titolo per la firma"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newSignTitleSecond">Titolo Firma 2</Label>
                                <Input
                                  id="newSignTitleSecond"
                                  value={newSignTitleSecond}
                                  onChange={(e) => setNewSignTitleSecond(e.target.value)}
                                  placeholder="Inserisci il secondo titolo per la firma"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newSignNameSurname">Nome e Cognome</Label>
                                <Input
                                  id="newSignNameSurname"
                                  value={newSignNameSurname}
                                  onChange={(e) => setNewSignNameSurname(e.target.value)}
                                  placeholder="Inserisci nome e cognome"
                                />
                              </div>
                            </div>
                            <Button onClick={handleAddGroup} className="w-full">
                              <Plus className="mr-2 h-4 w-4" />
                              Aggiungi Gruppo Firma
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Gruppi Firma Salvati</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {signatureGroups.map((group) => (
                              <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <RadioGroup
                                    value={defaultGroup || ""}
                                    onValueChange={handleSetDefaultGroup}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value={group.id} id={group.id} />
                                      <Label htmlFor={group.id}>
                                        {group.titolo} {group.nome}
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveGroup(group.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="document">
                      <Card>
                        <CardHeader>
                          <CardTitle>Corpo del Documento</CardTitle>
                          <CardDescription>
                            Imposta il testo predefinito per il corpo del documento nelle segnalazioni
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="documentBody">Testo predefinito</Label>
                              <Textarea
                                id="documentBody"
                                placeholder="Inserisci il testo predefinito per il corpo del documento..."
                                value={defaultDocumentBody}
                                onChange={(e) => setDefaultDocumentBody(e.target.value)}
                                className="min-h-[300px]"
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button onClick={handleSaveDocumentBody}>
                                <Save className="h-4 w-4 mr-2" />
                                Salva
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="template">
                      <Card>
                        <CardHeader>
                          <CardTitle>Template Word</CardTitle>
                          <CardDescription>
                            Gestisci il template Word utilizzato per la generazione dei documenti
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {currentTemplateName && (
                              <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm font-medium">Template attuale:</p>
                                <p className="text-sm text-muted-foreground">{currentTemplateName}</p>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="template">Carica nuovo template</Label>
                              <Input
                                id="template"
                                type="file"
                                accept=".docx"
                                onChange={handleTemplateUpload}
                              />
                              <p className="text-sm text-muted-foreground">
                                Accetta solo file .docx
                              </p>
                            </div>

                            {currentTemplateName && (
                              <div className="space-y-2">
                                <Label>Anteprima Template</Label>
                                <div className="border rounded-lg overflow-hidden h-[600px]">
                                  <iframe
                                    src={`/api/preview-template?t=${Date.now()}`}
                                    className="w-full h-full"
                                    title="Anteprima Template"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Button onClick={handleDownloadTemplate} disabled={!currentTemplateName}>
                                <Download className="h-4 w-4 mr-2" />
                                Scarica Template Attuale
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 