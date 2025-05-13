import { AppSidebar } from "@/components/app-sidebar"
import { ExchangeList } from "@/components/exchange-list"
import { SiteHeader } from "@/components/site-header"
import { PageTransition } from "@/components/page-transition"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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
                <ExchangeList />
              </div>
            </PageTransition>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
