"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VillageSearch } from "@/components/village-profile/village-search"
import { VillageDetails } from "@/components/village-profile/village-details"
import { SchemeRecommendations } from "@/components/village-profile/scheme-recommendations"
import { InterventionPriority } from "@/components/village-profile/intervention-priority"
import { DSSStats } from "@/components/village-profile/dss-stats"
import { MapPin, Users, Award, TrendingUp } from "lucide-react"

export interface Village {
  village_name: string
  district: string
  state: string
  population: number
  households: number
  literacy_rate: number
  infrastructure_score: number
  fra_claims_count: number
  approved_claims: number
  coordinates: [number, number]
}

export function VillageProfileInterface() {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      {/* DSS Statistics */}
      <DSSStats />

      {/* Village Search */}
      <VillageSearch onVillageSelect={setSelectedVillage} />

      {/* Main Interface */}
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
                  {selectedVillage.district}, {selectedVillage.state} • Population:{" "}
                  {selectedVillage.population.toLocaleString()}
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
                <TabsTrigger value="schemes" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Scheme Recommendations
                </TabsTrigger>
                <TabsTrigger value="interventions" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Intervention Priority
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <VillageDetails village={selectedVillage} />
              </TabsContent>

              <TabsContent value="schemes" className="mt-6">
                <SchemeRecommendations village={selectedVillage} />
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
                  Search and select a village to view comprehensive profile and recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
