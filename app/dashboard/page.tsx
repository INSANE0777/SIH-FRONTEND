"use client"
import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { useLanguage } from "@/hooks/use-language"
// Update this import to match where you saved the enhanced component
import OfficialDashboard from "@/components/dashboard/official-dashboard"
// OR if you renamed the file:
// import { OfficialDashboard } from "@/components/dashboard/official-dashboard"

export default function DashboardPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />
      <main className="flex-1 bg-background">
        <OfficialDashboard />
      </main>
      <GovernmentFooter />
    </div>
  )
}