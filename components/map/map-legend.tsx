import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MapLegendProps {
  selectedLayers: {
    claims: boolean
    assets: boolean
    landUse: boolean
    villages: boolean
  }
}

export function MapLegend({ selectedLayers }: MapLegendProps) {
  return (
    <div className="space-y-4">
      {/* Claims Legend */}
      {selectedLayers.claims && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">FRA Claims</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Rejected</span>
            </div>
          </div>
        </div>
      )}

      {/* Assets Legend */}
      {selectedLayers.assets && (
        <>
          {selectedLayers.claims && <Separator />}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Community Assets</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
                <span className="text-xs">Schools & Health Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <span className="text-xs">Wells & Water Sources</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Land Use Legend */}
      {selectedLayers.landUse && (
        <>
          {(selectedLayers.claims || selectedLayers.assets) && <Separator />}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Land Use</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-200 border border-green-400" />
                <span className="text-xs">Forest Cover</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200 border border-blue-400" />
                <span className="text-xs">Water Bodies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-400" />
                <span className="text-xs">Agricultural Land</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Villages Legend */}
      {selectedLayers.villages && (
        <>
          {(selectedLayers.claims || selectedLayers.assets || selectedLayers.landUse) && <Separator />}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Villages</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                <span className="text-xs">Village Centers</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Scale Reference */}
      <Separator />
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Scale Reference</h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>1 km</span>
            <div className="w-8 h-0.5 bg-foreground" />
          </div>
          <Badge variant="outline" className="text-xs">
            Click features for details
          </Badge>
        </div>
      </div>
    </div>
  )
}
