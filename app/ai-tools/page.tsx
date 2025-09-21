import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { AIToolsInterface } from "@/components/ai-tools/ai-tools-interface"

export default function AIToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Tools & Document Analysis</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered tools for document processing, computer vision, and spatial analysis
            </p>
          </div>

          <AIToolsInterface />
        </div>
      </main>

      <GovernmentFooter />
    </div>
  )
}
