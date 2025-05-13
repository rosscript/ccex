import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex">
          <SidebarTrigger />
        </div>
        <div className="flex-1" />
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
