import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface LayersPanelProps {
  selectedLayers: {
    claims: boolean
    assets: boolean
    landUse: boolean
    villages: boolean
  }
  onLayerToggle: (layer: string, enabled: boolean) => void
}

export function LayersPanel({ selectedLayers, onLayerToggle }: LayersPanelProps) {
  const layers = [
    {
      key: "claims",
      label: "FRA Claims",
      description: "Individual and community claims",
      color: "bg-green-500",
      count: "15,247",
    },
    {
      key: "assets",
      label: "Community Assets",
      description: "Schools, wells, health centers",
      color: "bg-primary",
      count: "3,842",
    },
    {
      key: "landUse",
      label: "Land Use Classification",
      description: "Forest, agricultural, water bodies",
      color: "bg-yellow-500",
      count: "1.2M points",
    },
    {
      key: "villages",
      label: "Villages",
      description: "Village boundaries and centers",
      color: "bg-orange-500",
      count: "1,247",
    },
  ]

  return (
    <div className="space-y-4">
      {layers.map((layer) => (
        <div key={layer.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id={layer.key}
                checked={selectedLayers[layer.key as keyof typeof selectedLayers]}
                onCheckedChange={(checked) => onLayerToggle(layer.key, checked)}
              />
              <Label htmlFor={layer.key} className="text-sm font-medium">
                {layer.label}
              </Label>
            </div>
            <Badge variant="secondary" className="text-xs">
              {layer.count}
            </Badge>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <div className={`w-3 h-3 rounded-full ${layer.color}`} />
            <p className="text-xs text-muted-foreground">{layer.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
