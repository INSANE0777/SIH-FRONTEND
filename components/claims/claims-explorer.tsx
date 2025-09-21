"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, User, Calendar, RefreshCw, Filter, X } from "lucide-react"

export interface Claim {
  claim_id: string
  state: string
  district: string
  block?: string
  village: string
  claimant_name: string
  father_husband_name?: string
  tribal_group?: string
  claim_type: string
  claim_area_ha: number
  survey_number?: string
  latitude?: number
  longitude?: number
  claim_date: string
  verification_date?: string
  status: string
  patta_number?: string
  title_date?: string
  land_type?: string
  forest_division?: string
  gram_sabha_resolution_no?: string
  family_members?: number
  mobile_number?: number
  aadhaar_number?: number
  bank_account?: number
  ifsc_code?: string
}

export interface ClaimsFilters {
  status: string
  district: string
  village: string
  claimType: string
  tribalGroup: string
  searchTerm: string
}

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1"

export function ClaimsExplorer() {
  const [mounted, setMounted] = useState(false)
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [states, setStates] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>("Madhya Pradesh")
  const [districts, setDistricts] = useState<string[]>([])
  const [villages, setVillages] = useState<string[]>([])
  const [tribalGroups, setTribalGroups] = useState<string[]>([])
  const [filters, setFilters] = useState<ClaimsFilters>({
    status: "all",
    district: "all",
    village: "all",
    claimType: "all",
    tribalGroup: "all",
    searchTerm: "",
  })

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch available states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/states`)
        if (response.ok) {
          const data = await response.json()
          setStates(data.states || [])
          if (data.states.length > 0 && !data.states.includes(selectedState)) {
            setSelectedState(data.states[0])
          }
        }
      } catch (error) {
        console.error("Failed to fetch states:", error)
        setStates(["Madhya Pradesh", "Tripura", "Odisha", "Telangana"])
      }
    }
    fetchStates()
  }, [])

  // Fetch claims data for selected state
  useEffect(() => {
    const fetchClaims = async () => {
      if (!selectedState) return
      
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/claims/?state=${encodeURIComponent(selectedState)}&limit=5000`)
        if (response.ok) {
          const claimsData = await response.json()
          setClaims(claimsData)
          setFilteredClaims(claimsData)
          
          // Extract unique values for filter options
          const uniqueDistricts = [...new Set(claimsData.map(claim => claim.district).filter(Boolean))]
          const uniqueVillages = [...new Set(claimsData.map(claim => claim.village).filter(Boolean))]
          const uniqueTribalGroups = [...new Set(claimsData.map(claim => claim.tribal_group).filter(Boolean))]
          
          setDistricts(uniqueDistricts.sort())
          setVillages(uniqueVillages.sort())
          setTribalGroups(uniqueTribalGroups.sort())
        } else {
          console.error("Failed to fetch claims:", response.statusText)
          setClaims([])
          setFilteredClaims([])
        }
      } catch (error) {
        console.error("Error fetching claims:", error)
        setClaims([])
        setFilteredClaims([])
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [selectedState])

  // Apply filters
  useEffect(() => {
    let filtered = claims

    if (filters.status !== "all") {
      filtered = filtered.filter((claim) => claim.status === filters.status)
    }

    if (filters.district !== "all") {
      filtered = filtered.filter((claim) => claim.district === filters.district)
    }

    if (filters.village !== "all") {
      filtered = filtered.filter((claim) => claim.village === filters.village)
    }

    if (filters.claimType !== "all") {
      filtered = filtered.filter((claim) => claim.claim_type === filters.claimType)
    }

    if (filters.tribalGroup !== "all") {
      filtered = filtered.filter((claim) => claim.tribal_group === filters.tribalGroup)
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (claim) =>
          claim.claim_id.toLowerCase().includes(searchLower) ||
          claim.claimant_name.toLowerCase().includes(searchLower) ||
          claim.village.toLowerCase().includes(searchLower) ||
          claim.district.toLowerCase().includes(searchLower)
      )
    }

    setFilteredClaims(filtered)
  }, [claims, filters])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'under review': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const resetFilters = () => {
    setFilters({
      status: "all",
      district: "all",
      village: "all",
      claimType: "all",
      tribalGroup: "all",
      searchTerm: "",
    })
  }

  const getStatsData = () => {
    const totalClaims = filteredClaims.length
    const approvedClaims = filteredClaims.filter(c => c.status === 'Approved').length
    const pendingClaims = filteredClaims.filter(c => c.status === 'Pending').length
    const rejectedClaims = filteredClaims.filter(c => c.status === 'Rejected').length
    const totalArea = filteredClaims.reduce((sum, claim) => sum + (claim.claim_area_ha || 0), 0)

    return {
      totalClaims,
      approvedClaims,
      pendingClaims,
      rejectedClaims,
      totalArea: totalArea.toFixed(2)
    }
  }

  const stats = getStatsData()

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* State Selection Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>
              <div className="h-10 bg-muted rounded w-48"></div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-10 w-10 bg-muted rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table and Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded"></div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* State Selection */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Claims Explorer</CardTitle>
              <CardDescription>Explore FRA claims data across states</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold">{stats.totalClaims.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedClaims}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingClaims}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejectedClaims}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold">{stats.totalArea} ha</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({...prev, district: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.village} onValueChange={(value) => setFilters(prev => ({...prev, village: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {villages.slice(0, 100).map((village) => (
                  <SelectItem key={village} value={village}>{village}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.claimType} onValueChange={(value) => setFilters(prev => ({...prev, claimType: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Claim Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CR">CR (Community Rights)</SelectItem>
                <SelectItem value="IFR">IFR (Individual Forest Rights)</SelectItem>
                <SelectItem value="CFR">CFR (Community Forest Rights)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.tribalGroup} onValueChange={(value) => setFilters(prev => ({...prev, tribalGroup: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Tribal Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {tribalGroups.slice(0, 50).map((group) => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Claims ({filteredClaims.length.toLocaleString()})</CardTitle>
              <CardDescription>
                Showing {filteredClaims.length} of {claims.length} claims for {selectedState}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredClaims.map((claim) => (
                  <div
                    key={claim.claim_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedClaim?.claim_id === claim.claim_id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">{claim.claim_id}</span>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{claim.claimant_name}</p>
                          <p className="text-sm text-gray-600">
                            {claim.village}, {claim.district}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Area: {claim.claim_area_ha} ha</span>
                          <span>Type: {claim.claim_type}</span>
                          {claim.tribal_group && <span>Group: {claim.tribal_group}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredClaims.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No claims found matching your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedClaim ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Claim Details</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClaim(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">{selectedClaim.claim_id}</h4>
                  <Badge className={getStatusColor(selectedClaim.status)}>
                    {selectedClaim.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Claimant</label>
                    <p className="text-sm">{selectedClaim.claimant_name}</p>
                    {selectedClaim.father_husband_name && (
                      <p className="text-xs text-gray-500">S/O: {selectedClaim.father_husband_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-sm">{selectedClaim.village}</p>
                    <p className="text-sm">{selectedClaim.district}, {selectedClaim.state}</p>
                    {selectedClaim.block && (
                      <p className="text-xs text-gray-500">Block: {selectedClaim.block}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Area</label>
                      <p className="text-sm">{selectedClaim.claim_area_ha} ha</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm">{selectedClaim.claim_type}</p>
                    </div>
                  </div>

                  {selectedClaim.tribal_group && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tribal Group</label>
                      <p className="text-sm">{selectedClaim.tribal_group}</p>
                    </div>
                  )}

                  {selectedClaim.claim_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Claim Date</label>
                      <p className="text-sm">{new Date(selectedClaim.claim_date).toLocaleDateString()}</p>
                    </div>
                  )}

                  {selectedClaim.survey_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Survey Number</label>
                      <p className="text-sm">{selectedClaim.survey_number}</p>
                    </div>
                  )}

                  {selectedClaim.family_members && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Family Members</label>
                      <p className="text-sm">{selectedClaim.family_members}</p>
                    </div>
                  )}

                  {selectedClaim.patta_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patta Number</label>
                      <p className="text-sm font-mono text-xs">{selectedClaim.patta_number}</p>
                    </div>
                  )}

                  {selectedClaim.latitude && selectedClaim.longitude && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Coordinates</label>
                      <p className="text-xs font-mono">
                        {selectedClaim.latitude.toFixed(6)}, {selectedClaim.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Claim Details</CardTitle>
                <CardDescription>Select a claim to view detailed information</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No claim selected</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}