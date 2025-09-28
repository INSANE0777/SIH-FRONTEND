"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapContainer } from "@/components/map/map-container"
import { MapControls } from "@/components/map/map-controls"
import { MapLegend } from "@/components/map/map-legend"
import { LayersPanel } from "@/components/map/layers-panel"
import { Layers, Info, Settings, Download } from "lucide-react"

export function MapInterface() {
  const [selectedLayers, setSelectedLayers] = useState({
    claims: true,
    assets: true,
    landUse: false,
    villages: false,
  })

  const [mapCenter, setMapCenter] = useState<[number, number]>([23.5, 78.9])
  const [mapZoom, setMapZoom] = useState(6)

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">WebGIS Map Interface</h1>
            <p className="text-sm text-muted-foreground">Interactive spatial analysis and visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Zoom: {mapZoom}</Badge>
            <Badge variant="outline">
              Center: {mapCenter[0].toFixed(2)}, {mapCenter[1].toFixed(2)}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r flex flex-col">
          {/* Layer Controls */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Map Layers</h2>
            </div>
            <LayersPanel
              selectedLayers={selectedLayers}
              onLayerToggle={(layer, enabled) => setSelectedLayers((prev) => ({ ...prev, [layer]: enabled }))}
            />
          </div>

          {/* Map Controls */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Map Controls</h2>
            </div>
            <MapControls center={mapCenter} zoom={mapZoom} onCenterChange={setMapCenter} onZoomChange={setMapZoom} />
          </div>

          {/* Legend */}
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Legend</h2>
            </div>
            <MapLegend selectedLayers={selectedLayers} />
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            selectedLayers={selectedLayers}
            onMapChange={(center, zoom) => {
              setMapCenter(center)
              setMapZoom(zoom)
            }}
          />
        </div>
      </div>
    </div>
  )
}
