import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileCheck, Clock, XCircle, TrendingUp } from "lucide-react"
import type { Claim } from "./claims-explorer"

interface ClaimsStatsProps {
  claims: Claim[]
  filteredClaims: Claim[]
}

export function ClaimsStats({ claims, filteredClaims }: ClaimsStatsProps) {
  const totalClaims = claims.length
  const approvedClaims = claims.filter((c) => c.status === "Approved").length
  const pendingClaims = claims.filter((c) => c.status === "Pending").length
  const rejectedClaims = claims.filter((c) => c.status === "Rejected").length
  const underReviewClaims = claims.filter((c) => c.status === "Under Review").length

  const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : "0"
  const totalArea = claims.reduce((sum, claim) => sum + claim.area_hectares, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalClaims.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Showing {filteredClaims.length} filtered</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <FileCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{approvedClaims}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>{approvalRate}% approval rate</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingClaims + underReviewClaims}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              Requires Action
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{rejectedClaims}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{totalArea.toFixed(1)} ha total area</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
