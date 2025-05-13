import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { PageTransition } from "@/components/page-transition"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
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
                  <h1 className="text-3xl font-bold mb-6">Storico Segnalazioni</h1>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                      <p className="text-muted-foreground">Nessuna segnalazione presente</p>
                    </div>
                  </div>
                </div>
              </div>
            </PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 