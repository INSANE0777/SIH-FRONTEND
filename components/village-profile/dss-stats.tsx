import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Award, TrendingUp } from "lucide-react"

export function DSSStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Villages Analyzed</CardTitle>
          <MapPin className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">1,247</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Across 52 districts</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
          <Users className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">89,456</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              Active profiles
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scheme Matches</CardTitle>
          <Award className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">234,567</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Recommendations generated</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Interventions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">342</div>
          <p className="text-xs text-muted-foreground">High-priority locations</p>
        </CardContent>
      </Card>
    </div>
  )
}
