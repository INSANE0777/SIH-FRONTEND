import { GovernmentHeader } from "@/components/government-header"
import { GovernmentFooter } from "@/components/government-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClaimIdRecommender } from "@/components/dss/claim-id-recommender"
import { ChatRecommender } from "@/components/dss/chat-recommendations"
import { FileSearch, Bot } from "lucide-react"

export default function DSSPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovernmentHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Decision Support System</h1>
            <p className="text-muted-foreground">
              Generate personalized government scheme recommendations using multiple data-driven methods.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="claim_id" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="claim_id" className="flex items-center gap-2">
                    <FileSearch className="h-4 w-4" />
                    By Beneficiary ID
                  </TabsTrigger>
                  
                  <TabsTrigger value="ai_chat" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Chat Assistant
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1 Content */}
                <TabsContent value="claim_id" className="mt-6">
                  <ClaimIdRecommender />
                </TabsContent>

                {/* Tab 2 Content */}
                <TabsContent value="ai_chat" className="mt-6">
                  <ChatRecommender />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <GovernmentFooter />
    </div>
  )
}
