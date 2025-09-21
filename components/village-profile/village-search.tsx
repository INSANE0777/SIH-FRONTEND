"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users } from "lucide-react"
import type { Village } from "./village-profile-interface"

interface VillageSearchProps {
  onVillageSelect: (village: Village) => void
}

export function VillageSearch({ onVillageSelect }: VillageSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Village[]>([])
  const [loading, setLoading] = useState(false)

  // Mock villages data
  const mockVillages: Village[] = [
    {
      village_name: "Devigarh Khurd",
      district: "Balaghat",
      state: "Madhya Pradesh",
      population: 2847,
      households: 542,
      literacy_rate: 68.5,
      infrastructure_score: 6.2,
      fra_claims_count: 89,
      approved_claims: 67,
      coordinates: [21.8, 80.2],
    },
    {
      village_name: "Barghat",
      district: "Seoni",
      state: "Madhya Pradesh",
      population: 3421,
      households: 687,
      literacy_rate: 72.3,
      infrastructure_score: 7.1,
      fra_claims_count: 124,
      approved_claims: 89,
      coordinates: [22.1, 79.5],
    },
    {
      village_name: "Ghughri",
      district: "Mandla",
      state: "Madhya Pradesh",
      population: 1956,
      households: 398,
      literacy_rate: 61.8,
      infrastructure_score: 5.4,
      fra_claims_count: 67,
      approved_claims: 45,
      coordinates: [22.6, 80.4],
    },
    {
      village_name: "Samnapur",
      district: "Dindori",
      state: "Madhya Pradesh",
      population: 2134,
      households: 456,
      literacy_rate: 65.2,
      infrastructure_score: 5.8,
      fra_claims_count: 78,
      approved_claims: 52,
      coordinates: [22.9, 81.1],
    },
    {
      village_name: "Mohgaon",
      district: "Chhindwara",
      state: "Madhya Pradesh",
      population: 4567,
      households: 892,
      literacy_rate: 74.6,
      infrastructure_score: 7.8,
      fra_claims_count: 156,
      approved_claims: 112,
      coordinates: [22.1, 78.9],
    },
  ]

  useEffect(() => {
    if (searchTerm.length > 2) {
      setLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = mockVillages.filter(
          (village) =>
            village.village_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            village.district.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setSearchResults(filtered)
        setLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Village Search
        </CardTitle>
        <CardDescription>Search for villages to access comprehensive profiles and analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by village name or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Searching villages...</span>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search Results ({searchResults.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((village) => (
                <div
                  key={`${village.village_name}-${village.district}`}
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onVillageSelect(village)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-medium">{village.village_name}</span>
                        <p className="text-xs text-muted-foreground">
                          {village.district}, {village.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {village.population.toLocaleString()}
                      </Badge>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm.length > 2 && searchResults.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No villages found matching "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
