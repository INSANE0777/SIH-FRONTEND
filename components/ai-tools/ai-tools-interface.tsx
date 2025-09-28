"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Satellite, Brain, TrendingUp } from "lucide-react"

// Import the integrated components
import { OCRProcessor } from "./ocr-processor"
import { LandCoverAnalysis } from "./land-cover-analysis"

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1"

interface AIToolsStatsData {
  documents_processed: number
  land_cover_maps: number
  avg_processing_time: number
  success_rate: number
}

function AIToolsStats() {
  const [stats, setStats] = useState<AIToolsStatsData>({
    documents_processed: 0,
    land_cover_maps: 0,
    avg_processing_time: 0,
    success_rate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you'd fetch these stats from your backend
    // For now, using mock data that could come from your analytics endpoints
    const fetchStats = async () => {
      try {
        // This could be a real endpoint like: /api/v1/analytics/ai-tools-stats
        // const response = await fetch(`${API_BASE_URL}/analytics/ai-tools-stats`)
        // const data = await response.json()
        
        // Mock data for demonstration
        setStats({
          documents_processed: 2847,
          land_cover_maps: 456,
          avg_processing_time: 5.3,
          success_rate: 98.4
        })
      } catch (error) {
        console.error("Failed to fetch AI tools stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
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
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.documents_processed.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>OCR & Form Analysis</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Land Cover Maps</CardTitle>
          <Satellite className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.land_cover_maps}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Satellite imagery processed</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 border-emerald-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{stats.success_rate}%</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
              High accuracy
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avg_processing_time}s</div>
          <p className="text-xs text-muted-foreground">Per document/image</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function AIToolsInterface() {
  const [activeTab, setActiveTab] = useState("ocr")

  return (
    <div className="space-y-6">
      {/* AI Tools Stats */}
      <AIToolsStats />

      {/* Main AI Tools Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>AI-Powered Analysis Tools</CardTitle>
              <CardDescription>
                Process FRA documents and analyze satellite imagery using advanced AI models for enhanced data extraction and land cover classification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ocr" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                OCR & Document Processing
              </TabsTrigger>
              <TabsTrigger value="landcover" className="flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                Land Cover Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ocr" className="mt-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">Document OCR & Form Analysis</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Upload FRA forms (Form A, B, C) to automatically extract claimant information, land details, and other structured data using YOLO-based OCR processing. Results can be directly converted into new claims in the system.
                      </p>
                    </div>
                  </div>
                </div>
                <OCRProcessor />
              </div>
            </TabsContent>

            <TabsContent value="landcover" className="mt-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Satellite className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-900">Satellite Image Land Cover Classification</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Analyze high-resolution satellite imagery to classify land cover types including forest cover, agricultural land, water bodies, and built-up areas. Uses U-Net deep learning architecture with enhanced water body detection through computer vision techniques.
                      </p>
                    </div>
                  </div>
                </div>
                <LandCoverAnalysis />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}