import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { VillageProfileInterface } from "@/components/village-profile/village-profile-interface"

export default function VillageProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Village Profile & Decision Support</h1>
            <p className="text-muted-foreground">
              Comprehensive village analysis, scheme recommendations, and intervention priority planning
            </p>
          </div>

          <VillageProfileInterface />
        </div>
      </main>

      <GovernmentFooter />
    </div>
  )
}
