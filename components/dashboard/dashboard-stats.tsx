"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, FileCheck, MapPin, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardData {
  total_claims: number
  approval_rate: number
  pending_claims: number
  rejected_claims: number
  district_count: number
  village_count: number
}

export function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/v1/dashboard/")
        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)
        } else {
          // Fallback data for demo
          setData({
            total_claims: 15247,
            approval_rate: 65.7,
            pending_claims: 3842,
            rejected_claims: 1205,
            district_count: 52,
            village_count: 1247,
          })
        }
      } catch (error) {
        console.log("[v0] Dashboard API error:", error)
        // Fallback data for demo
        setData({
          total_claims: 15247,
          approval_rate: 65.7,
          pending_claims: 3842,
          rejected_claims: 1205,
          district_count: 52,
          village_count: 1247,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  const approvedClaims = Math.round((data.total_claims * data.approval_rate) / 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{data.total_claims.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>+12% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <FileCheck className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{data.approval_rate}%</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{approvedClaims.toLocaleString()} approved</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
          <AlertTriangle className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{data.pending_claims.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              Requires Action
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Districts Covered</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.district_count}</div>
          <p className="text-xs text-muted-foreground">Across multiple states</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Villages</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.village_count.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Rural communities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Claims</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{data.rejected_claims.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {((data.rejected_claims / data.total_claims) * 100).toFixed(1)}% rejection rate
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
