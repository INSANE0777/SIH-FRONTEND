import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Map, FileText, Brain, BarChart3, Upload, Search } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Map className="h-4 w-4 mr-2" />
          Open WebGIS Map
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Browse Claims
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Brain className="h-4 w-4 mr-2" />
          AI Document Analysis
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </CardContent>
    </Card>
  )
}
