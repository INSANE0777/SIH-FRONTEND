"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VillageSearch } from "@/components/village-profile/village-search"
import { VillageDetails } from "@/components/village-profile/village-details"
import { ClaimSelector } from "@/components/village-profile/claim-selector"
import { ClaimRecommendations } from "@/components/village-profile/claim-recommendations"
import { InterventionPriority } from "@/components/village-profile/intervention-priority"
import { DSSStats } from "@/components/village-profile/dss-stats"
import { MapPin, Users, Award, TrendingUp } from "lucide-react"

// Defines the structure of a Village object used across components
export interface Village {
  village_name: string
  district: string
  state: string
  // These fields are part of the mock data for the search component
  population: number
  households: number
  literacy_rate: number
  fra_claims_count: number
  approved_claims: number
}

export function VillageProfileInterface() {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  // This function is called when a village is selected from the search results
  const handleVillageSelect = (village: Village) => {
    setSelectedVillage(village)
    setSelectedClaimId(null) // Reset claim selection when village changes
    setActiveTab("profile")   // Always switch back to the profile tab
  }

  return (
    <div className="space-y-6">
      <DSSStats />
      <VillageSearch onVillageSelect={handleVillageSelect} />

      {selectedVillage ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{selectedVillage.village_name}</CardTitle>
                <CardDescription>
                  {selectedVillage.district}, {selectedVillage.state}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Village Profile
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Claim Recommendations
                </TabsTrigger>
                <TabsTrigger value="interventions" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  State Interventions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <VillageDetails village={selectedVillage} />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6 space-y-6">
                <ClaimSelector village={selectedVillage} onClaimSelect={setSelectedClaimId} selectedClaimId={selectedClaimId} />
                {selectedClaimId ? (
                  <ClaimRecommendations claimId={selectedClaimId} />
                ) : (
                  <p className="text-center text-muted-foreground pt-4">Please select a claim to see recommendations.</p>
                )}
              </TabsContent>

              <TabsContent value="interventions" className="mt-6">
                <InterventionPriority village={selectedVillage} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-foreground">Select a Village</h3>
                <p className="text-muted-foreground">
                  Search and select a village to view its profile and get recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}