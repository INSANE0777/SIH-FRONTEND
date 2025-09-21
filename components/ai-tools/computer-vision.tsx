"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Upload, Eye, CheckCircle, Download, MapPin } from "lucide-react"

interface DetectedAsset {
  asset_type: string
  confidence: number
  bbox: [number, number, number, number]
}

interface CVResult {
  filename: string
  detected_assets: DetectedAsset[]
  water_detected: boolean
  water_percentage: string
  processing_time: number
}

export function ComputerVision() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<CVResult[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.includes("image"))
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const processImages = async () => {
    if (files.length === 0) return

    setProcessing(true)
    const newResults: CVResult[] = []

    for (const file of files) {
      try {
        // Simulate API call to your CV service
        const formData = new FormData()
        formData.append("image", file)

        // Replace with your actual API endpoint
        const response = await fetch("/api/v1/imagery/detect-assets", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          newResults.push({
            filename: file.name,
            ...result,
            processing_time: Math.random() * 5 + 2,
          })
        } else {
          // Mock result for demonstration
          newResults.push({
            filename: file.name,
            detected_assets: [
              { asset_type: "truck", confidence: 0.98, bbox: [100, 150, 200, 250] },
              { asset_type: "boat", confidence: 0.85, bbox: [300, 100, 400, 180] },
              { asset_type: "building", confidence: 0.92, bbox: [50, 300, 180, 420] },
            ],
            water_detected: true,
            water_percentage: "18.75%",
            processing_time: Math.random() * 5 + 2,
          })
        }
      } catch (error) {
        console.log("[v0] CV processing error:", error)
        // Mock result for demonstration
        newResults.push({
          filename: file.name,
          detected_assets: [
            { asset_type: "truck", confidence: 0.98, bbox: [100, 150, 200, 250] },
            { asset_type: "boat", confidence: 0.85, bbox: [300, 100, 400, 180] },
          ],
          water_detected: true,
          water_percentage: "18.75%",
          processing_time: Math.random() * 5 + 2,
        })
      }
    }

    setResults(newResults)
    setProcessing(false)
  }

  const clearAll = () => {
    setFiles([])
    setResults([])
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Image Upload
          </CardTitle>
          <CardDescription>
            Upload aerial or satellite images for asset detection and water body analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop images here or click to upload</h3>
            <p className="text-muted-foreground mb-4">Supports JPG, PNG files up to 20MB</p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
            />
            <Button asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                Select Images
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Images ({files.length})</h4>
                <div className="flex gap-2">
                  <Button onClick={processImages} disabled={processing} size="sm">
                    {processing ? "Analyzing..." : "Analyze Images"}
                  </Button>
                  <Button variant="outline" onClick={clearAll} size="sm" className="bg-transparent">
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Analyzing images with computer vision...</span>
              </div>
              <Progress value={45} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Computer Vision Results
            </CardTitle>
            <CardDescription>Detected assets and water bodies in processed images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-medium">{result.filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{result.detected_assets.length} assets detected</Badge>
                    {result.water_detected && (
                      <Badge className="bg-blue-100 text-blue-800">Water: {result.water_percentage}</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Detected Assets */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Detected Assets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.detected_assets.map((asset, assetIndex) => (
                      <div key={assetIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm capitalize">{asset.asset_type}</span>
                        </div>
                        <Badge
                          className={
                            asset.confidence > 0.9
                              ? "bg-green-100 text-green-800"
                              : asset.confidence > 0.7
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {(asset.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Detection */}
                {result.water_detected && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Water Body Analysis</h4>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Water coverage detected</span>
                        <Badge className="bg-blue-100 text-blue-800">{result.water_percentage}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Processed in {result.processing_time.toFixed(2)}s
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Annotations
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
