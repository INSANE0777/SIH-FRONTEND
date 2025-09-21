"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Search, Navigation } from "lucide-react"

interface MapControlsProps {
  center: [number, number]
  zoom: number
  onCenterChange: (center: [number, number]) => void
  onZoomChange: (zoom: number) => void
}

export function MapControls({ center, zoom, onCenterChange, onZoomChange }: MapControlsProps) {
  const presetLocations = [
    { name: "Madhya Pradesh", coords: [23.5, 78.9] as [number, number] },
    { name: "Balaghat District", coords: [21.8, 80.2] as [number, number] },
    { name: "Seoni District", coords: [22.1, 79.5] as [number, number] },
    { name: "Mandla District", coords: [22.6, 80.4] as [number, number] },
  ]

  return (
    <div className="space-y-4">
      {/* Quick Navigation */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick Navigation</Label>
        <Select
          onValueChange={(value) => {
            const location = presetLocations.find((loc) => loc.name === value)
            if (location) {
              onCenterChange(location.coords)
              onZoomChange(8)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {presetLocations.map((location) => (
              <SelectItem key={location.name} value={location.name}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Coordinates Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Center Coordinates</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="lat" className="text-xs text-muted-foreground">
              Latitude
            </Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={center[0].toFixed(4)}
              onChange={(e) => onCenterChange([Number.parseFloat(e.target.value) || center[0], center[1]])}
              className="text-xs"
            />
          </div>
          <div>
            <Label htmlFor="lng" className="text-xs text-muted-foreground">
              Longitude
            </Label>
            <Input
              id="lng"
              type="number"
              step="0.0001"
              value={center[1].toFixed(4)}
              onChange={(e) => onCenterChange([center[0], Number.parseFloat(e.target.value) || center[1]])}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Zoom Control */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Zoom Level</Label>
        <div className="flex items-center gap-2">
          <Input
            type="range"
            min="1"
            max="18"
            value={zoom}
            onChange={(e) => onZoomChange(Number.parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono w-8">{zoom}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Home className="h-4 w-4 mr-2" />
          Reset View
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Search className="h-4 w-4 mr-2" />
          Search Location
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
      </div>
    </div>
  )
}
