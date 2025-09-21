"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Calendar, User, FileText } from "lucide-react"
import type { Claim } from "./claims-explorer"

interface ClaimsTableProps {
  claims: Claim[]
  onClaimSelect: (claim: Claim) => void
  selectedClaim: Claim | null
}

export function ClaimsTable({ claims, onClaimSelect, selectedClaim }: ClaimsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getClaimTypeIcon = (type: string) => {
    return type === "Individual" ? <User className="h-3 w-3" /> : <FileText className="h-3 w-3" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Claims Records ({claims.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Area (ha)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No claims found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                claims.map((claim) => (
                  <TableRow
                    key={claim.claim_id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedClaim?.claim_id === claim.claim_id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => onClaimSelect(claim)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {claim.claim_id}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getClaimTypeIcon(claim.claim_type)}
                        <span className="font-medium">{claim.claimant_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{claim.village}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {claim.claim_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(claim.status)}`}>{claim.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{claim.district}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{claim.area_hectares}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(claim.submission_date).toLocaleDateString("en-IN")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onClaimSelect(claim)
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
