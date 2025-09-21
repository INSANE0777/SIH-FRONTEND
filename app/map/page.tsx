import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { MapInterface } from "@/components/map/map-interface"

export default function MapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1">
        <MapInterface />
      </main>

      <GovernmentFooter />
    </div>
  )
}
