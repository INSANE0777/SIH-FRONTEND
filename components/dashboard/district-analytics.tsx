"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, TrendingUp } from "lucide-react"

const topDistricts = [
  { name: "Balaghat", claims: 1247, approval_rate: 72.3, area_sq_km: 4546.42 },
  { name: "Seoni", claims: 1089, approval_rate: 68.7, area_sq_km: 2855.41 },
  { name: "Mandla", claims: 987, approval_rate: 71.2, area_sq_km: 3421.18 },
  { name: "Dindori", claims: 856, approval_rate: 69.8, area_sq_km: 2987.65 },
  { name: "Chhindwara", claims: 743, approval_rate: 66.4, area_sq_km: 2156.89 },
]

export function DistrictAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Top Districts by Claims
        </CardTitle>
        <CardDescription>Districts with highest FRA claim activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topDistricts.map((district, index) => (
          <div key={district.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
                <span className="font-medium">{district.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{district.claims} claims</div>
                <div className="text-xs text-muted-foreground">{district.area_sq_km.toLocaleString()} km²</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Approval Rate</span>
                <span className="font-medium">{district.approval_rate}%</span>
              </div>
              <Progress value={district.approval_rate} className="h-2" />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Average approval rate: 69.7%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
