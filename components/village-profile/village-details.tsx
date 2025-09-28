"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText } from "lucide-react"
import type { Village } from "./village-profile-interface"

// Define interfaces to match the backend API response structure
interface VillageProfileData {
  profile_for: string
  socioeconomic_data: any[]
  fra_claims_summary: { status: string; count: number }[]
  district_land_use_summary: any[]
}

interface VillageDetailsProps {
  village: Village
}

export function VillageDetails({ village }: VillageDetailsProps) {
  const [profile, setProfile] = useState<VillageProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!village) return

    const fetchVillageProfile = async () => {
      setLoading(true)
      try {
        // API call to the backend endpoint
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/dss/village-profile?state=${encodeURIComponent(village.state)}&district=${encodeURIComponent(village.district)}&village=${encodeURIComponent(village.village_name)}`,
        )
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          console.error("Failed to fetch village profile:", response.statusText)
          setProfile(null)
        }
      } catch (error) {
        console.error("API error fetching village profile:", error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchVillageProfile()
  }, [village])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader><div className="h-6 bg-muted rounded w-1/3"></div></CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return <p>No profile data available for this village.</p>
  }

  // Helper to extract claim counts safely
  const getClaimCount = (status: string) => {
    const item = profile.fra_claims_summary.find(s => s.status.toLowerCase() === status.toLowerCase());
    return item ? item.count : 0;
  };
  
  const totalClaims = profile.fra_claims_summary.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Socioeconomic Profile
          </CardTitle>
          <CardDescription>
            Demographics for {profile.socioeconomic_data[0]?.village || village.village_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(profile.socioeconomic_data[0] || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                    <h4 className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}</h4>
                    <p className="text-muted-foreground">{String(value)}</p>
                </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            FRA Claims Summary
          </CardTitle>
          <CardDescription>Forest Rights Act claims status for this village</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalClaims}</div>
              <div className="text-sm text-muted-foreground">Total Claims</div>
            </div>
             <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getClaimCount('Approved')}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{getClaimCount('Pending')}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{getClaimCount('Rejected')}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}