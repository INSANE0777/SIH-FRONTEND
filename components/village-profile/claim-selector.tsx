"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // CORRECTED IMPORT
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import type { Village } from "./village-profile-interface"

interface Claim {
  claim_id: string
  claimant_name: string
  status: string
}

interface ClaimSelectorProps {
  village: Village
  onClaimSelect: (claimId: string) => void
  selectedClaimId: string | null
}

export function ClaimSelector({ village, onClaimSelect, selectedClaimId }: ClaimSelectorProps) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!village) return

    const fetchClaims = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `http://122.160.55.196:8000/api/v1/claims/?state=${encodeURIComponent(village.state)}&district=${encodeURIComponent(village.district)}&village=${encodeURIComponent(village.village_name)}`,
        )
        if (response.ok) {
          const data = await response.json()
          setClaims(data)
        } else {
          console.error("Failed to fetch claims")
          setClaims([])
        }
      } catch (error) {
        console.error("API error fetching claims:", error)
        setClaims([])
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [village])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Beneficiary Claim</CardTitle>
        <CardDescription>Choose a claim to view personalized scheme recommendations.</CardDescription>
      </CardHeader>
      <CardContent> {/* This now works */}
        {loading ? (
          <div className="h-10 w-full bg-muted rounded animate-pulse"></div>
        ) : (
          <Select onValueChange={onClaimSelect} value={selectedClaimId ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a claim..." />
            </SelectTrigger>
            <SelectContent> {/* This also works */}
              {claims.length > 0 ? (
                claims.map(claim => (
                  <SelectItem key={claim.claim_id} value={claim.claim_id}>
                    {claim.claimant_name} ({claim.claim_id}) - <span className="capitalize">{claim.status}</span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No claims found for this village.</div>
              )}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  )
}