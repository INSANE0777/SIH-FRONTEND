"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Users, GraduationCap, Home, Droplets, Zap, MapPin, FileText } from "lucide-react"
import type { Village } from "./village-profile-interface"

interface VillageProfile {
  socioeconomic_data: {
    population: number
    households: number
    literacy_rate: number
    employment_rate: number
    poverty_index: number
  }
  infrastructure_data: {
    water_access: number
    electricity_access: number
    road_connectivity: number
    health_facilities: number
    education_facilities: number
  }
  fra_claims_summary: {
    total_claims: number
    approved_claims: number
    pending_claims: number
    rejected_claims: number
    total_area_hectares: number
  }
}

interface VillageDetailsProps {
  village: Village
}

export function VillageDetails({ village }: VillageDetailsProps) {
  const [profile, setProfile] = useState<VillageProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVillageProfile = async () => {
      setLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/v1/dss/village-profile?village=${encodeURIComponent(village.village_name)}`)
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
        } else {
          // Mock data for demonstration
          setProfile({
            socioeconomic_data: {
              population: village.population,
              households: village.households,
              literacy_rate: village.literacy_rate,
              employment_rate: 67.8,
              poverty_index: 3.2,
            },
            infrastructure_data: {
              water_access: 78.5,
              electricity_access: 89.2,
              road_connectivity: 65.4,
              health_facilities: 2,
              education_facilities: 3,
            },
            fra_claims_summary: {
              total_claims: village.fra_claims_count,
              approved_claims: village.approved_claims,
              pending_claims: village.fra_claims_count - village.approved_claims - 5,
              rejected_claims: 5,
              total_area_hectares: 156.7,
            },
          })
        }
      } catch (error) {
        console.log("[v0] Village profile API error:", error)
        // Mock data for demonstration
        setProfile({
          socioeconomic_data: {
            population: village.population,
            households: village.households,
            literacy_rate: village.literacy_rate,
            employment_rate: 67.8,
            poverty_index: 3.2,
          },
          infrastructure_data: {
            water_access: 78.5,
            electricity_access: 89.2,
            road_connectivity: 65.4,
            health_facilities: 2,
            education_facilities: 3,
          },
          fra_claims_summary: {
            total_claims: village.fra_claims_count,
            approved_claims: village.approved_claims,
            pending_claims: village.fra_claims_count - village.approved_claims - 5,
            rejected_claims: 5,
            total_area_hectares: 156.7,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVillageProfile()
  }, [village])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!profile) return null

  const approvalRate = (
    (profile.fra_claims_summary.approved_claims / profile.fra_claims_summary.total_claims) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Socioeconomic Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Socioeconomic Profile
          </CardTitle>
          <CardDescription>Population demographics and economic indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Population</span>
                <Badge variant="outline">{profile.socioeconomic_data.population.toLocaleString()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Households</span>
                <Badge variant="outline">{profile.socioeconomic_data.households.toLocaleString()}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Literacy Rate</span>
                <span>{profile.socioeconomic_data.literacy_rate}%</span>
              </div>
              <Progress value={profile.socioeconomic_data.literacy_rate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Employment Rate</span>
                <span>{profile.socioeconomic_data.employment_rate}%</span>
              </div>
              <Progress value={profile.socioeconomic_data.employment_rate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Infrastructure Assessment
          </CardTitle>
          <CardDescription>Access to basic services and facilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Water Access</span>
                <span className="ml-auto text-sm">{profile.infrastructure_data.water_access}%</span>
              </div>
              <Progress value={profile.infrastructure_data.water_access} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Electricity Access</span>
                <span className="ml-auto text-sm">{profile.infrastructure_data.electricity_access}%</span>
              </div>
              <Progress value={profile.infrastructure_data.electricity_access} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Road Connectivity</span>
                <span className="ml-auto text-sm">{profile.infrastructure_data.road_connectivity}%</span>
              </div>
              <Progress value={profile.infrastructure_data.road_connectivity} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Education Facilities</span>
                <Badge variant="outline">{profile.infrastructure_data.education_facilities} schools</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FRA Claims Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            FRA Claims Summary
          </CardTitle>
          <CardDescription>Forest Rights Act claims status for this village</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{profile.fra_claims_summary.total_claims}</div>
              <div className="text-sm text-muted-foreground">Total Claims</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile.fra_claims_summary.approved_claims}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{profile.fra_claims_summary.pending_claims}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{profile.fra_claims_summary.rejected_claims}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Approval Rate</span>
              <p className="text-xs text-muted-foreground">Overall success rate for this village</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{approvalRate}%</div>
              <div className="text-xs text-muted-foreground">
                {profile.fra_claims_summary.total_area_hectares} ha total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
