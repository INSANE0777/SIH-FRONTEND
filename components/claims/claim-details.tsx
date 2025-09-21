"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, User, FileText, X, ExternalLink, Download } from "lucide-react"
import type { Claim } from "./claims-explorer"

interface ClaimDetailsProps {
  claim: Claim
  onClose: () => void
}

export function ClaimDetails({ claim, onClose }: ClaimDetailsProps) {
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

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Claim Details
            </CardTitle>
            <CardDescription>Complete information for {claim.claim_id}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Claim ID</span>
            <Badge variant="outline" className="font-mono">
              {claim.claim_id}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge className={`text-xs ${getStatusColor(claim.status)}`}>{claim.status}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type</span>
            <div className="flex items-center gap-1">
              {claim.claim_type === "Individual" ? <User className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              <span className="text-sm">{claim.claim_type}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Claimant Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Claimant Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{claim.claimant_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Village</span>
              <span className="text-sm">{claim.village}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">District</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{claim.district}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Land Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Land Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Area</span>
              <span className="text-sm font-mono">{claim.area_hectares} hectares</span>
            </div>
            {claim.latitude && claim.longitude && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coordinates</span>
                <span className="text-sm font-mono">
                  {claim.latitude.toFixed(4)}, {claim.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Submitted</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{new Date(claim.submission_date).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{new Date(claim.last_updated).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button size="sm" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Record
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Documents
          </Button>
          {claim.latitude && claim.longitude && (
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
