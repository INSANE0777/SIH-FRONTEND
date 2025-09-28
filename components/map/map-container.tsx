"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Home, Factory } from "lucide-react"

interface MapContainerProps {
  center: [number, number]
  zoom: number
  selectedLayers: {
    claims: boolean
    assets: boolean
    landUse: boolean
    villages: boolean
  }
  onMapChange: (center: [number, number], zoom: number) => void
}

// Mock data for demonstration
const mockClaims = [
  { id: "FRA-MP-001", lat: 23.5, lng: 78.9, status: "Approved", claimant: "Ram Singh" },
  { id: "FRA-MP-002", lat: 23.6, lng: 79.1, status: "Pending", claimant: "Sita Devi" },
  { id: "FRA-MP-003", lat: 23.4, lng: 78.7, status: "Rejected", claimant: "Mohan Lal" },
  { id: "FRA-MP-004", lat: 23.7, lng: 79.2, status: "Approved", claimant: "Geeta Bai" },
]

const mockAssets = [
  { id: "AST-001", lat: 23.52, lng: 78.95, type: "School", condition: "Good" },
  { id: "AST-002", lat: 23.58, lng: 79.05, type: "Well", condition: "Fair" },
  { id: "AST-003", lat: 23.45, lng: 78.75, type: "Health Center", condition: "Poor" },
  { id: "AST-004", lat: 23.65, lng: 79.15, type: "Community Hall", condition: "Good" },
]

export function MapContainer({ center, zoom, selectedLayers, onMapChange }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedFeature, setSelectedFeature] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "School":
        return <Home className="h-3 w-3" />
      case "Well":
        return <Factory className="h-3 w-3" />
      case "Health Center":
        return <MapPin className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Background */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
          `,
        }}
      >
        {/* Grid overlay for map feel */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Claims Layer */}
        {selectedLayers.claims &&
          mockClaims.map((claim) => (
            <div
              key={claim.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${(claim.lng - center[1]) * 100 + 50}%`,
                top: `${-(claim.lat - center[0]) * 100 + 50}%`,
              }}
              onClick={() => setSelectedFeature({ type: "claim", data: claim })}
            >
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(claim.status)} border-2 border-white shadow-lg hover:scale-125 transition-transform`}
              />
            </div>
          ))}

        {/* Assets Layer */}
        {selectedLayers.assets &&
          mockAssets.map((asset) => (
            <div
              key={asset.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${(asset.lng - center[1]) * 100 + 50}%`,
                top: `${-(asset.lat - center[0]) * 100 + 50}%`,
              }}
              onClick={() => setSelectedFeature({ type: "asset", data: asset })}
            >
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                {getAssetIcon(asset.type)}
              </div>
            </div>
          ))}

        {/* Land Use Layer (when enabled) */}
        {selectedLayers.landUse && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-200/30 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-200/30 rounded-full" />
            <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-yellow-200/30 rounded-full" />
          </div>
        )}

        {/* Villages Layer (when enabled) */}
        {selectedLayers.villages && (
          <>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm shadow-lg" />
            </div>
            <div className="absolute top-2/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-orange-500 rounded-sm shadow-lg" />
            </div>
          </>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card shadow-lg"
            onClick={() => onMapChange(center, Math.min(zoom + 1, 18))}
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card shadow-lg"
            onClick={() => onMapChange(center, Math.max(zoom - 1, 1))}
          >
            -
          </Button>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-card px-3 py-1 rounded shadow-lg text-sm">
            Scale: 1:{(1000000 / zoom).toLocaleString()}
          </div>
        </div>

        {/* Coordinates display */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-card px-3 py-1 rounded shadow-lg text-sm">
            {center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E
          </div>
        </div>
      </div>

      {/* Feature Info Panel */}
      {selectedFeature && (
        <div className="absolute top-4 left-4 w-80">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {selectedFeature.type === "claim" ? "FRA Claim" : "Community Asset"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFeature(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedFeature.type === "claim" ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Claim ID:</span>
                    <Badge variant="outline">{selectedFeature.data.id}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Claimant:</span>
                    <span className="text-sm">{selectedFeature.data.claimant}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getStatusColor(selectedFeature.data.status)}>{selectedFeature.data.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">
                      {selectedFeature.data.lat.toFixed(4)}, {selectedFeature.data.lng.toFixed(4)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Asset ID:</span>
                    <Badge variant="outline">{selectedFeature.data.id}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <span className="text-sm">{selectedFeature.data.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Condition:</span>
                    <Badge variant={selectedFeature.data.condition === "Good" ? "default" : "secondary"}>
                      {selectedFeature.data.condition}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm">
                      {selectedFeature.data.lat.toFixed(4)}, {selectedFeature.data.lng.toFixed(4)}
                    </span>
                  </div>
                </>
              )}
              <Button size="sm" className="w-full mt-4">
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
