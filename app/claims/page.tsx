import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { ClaimsExplorer } from "@/components/claims/claims-explorer"

export default function ClaimsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Claims Data Explorer</h1>
            <p className="text-muted-foreground">Search, filter, and manage Forest Rights Act claims records</p>
          </div>

          <ClaimsExplorer />
        </div>
      </main>

      <GovernmentFooter />
    </div>
  )
}
