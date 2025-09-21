"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Satellite, CheckCircle, Download, BarChart3, AlertCircle, Image as ImageIcon } from "lucide-react"

interface LandCoverStats {
  [key: string]: string
}

interface LandCoverResult {
  filename: string
  segmentation_mask_base64: string
  land_cover_statistics: LandCoverStats
  processing_time: number
  success: boolean
  error?: string
  original_size?: {
    width: number
    height: number
  }
}

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1"

export function LandCoverAnalysis() {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<LandCoverResult[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [selectedMask, setSelectedMask] = useState<string | null>(null)

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

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.includes("image")
    )
    setFiles((prev) => [...prev, ...droppedFiles])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processImages = async () => {
    if (files.length === 0) return

    setProcessing(true)
    setCurrentProgress(0)
    const newResults: LandCoverResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const startTime = Date.now()
      
      try {
        setCurrentProgress(((i + 0.5) / files.length) * 100)
        
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${API_BASE_URL}/imagery/segment-land-cover`, {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          const processingTime = (Date.now() - startTime) / 1000

          newResults.push({
            filename: result.filename || file.name,
            segmentation_mask_base64: result.segmentation_mask_base64 || "",
            land_cover_statistics: result.land_cover_statistics || {},
            processing_time: processingTime,
            success: true,
            original_size: result.original_size
          })
        } else {
          const errorText = await response.text()
          newResults.push({
            filename: file.name,
            segmentation_mask_base64: "",
            land_cover_statistics: {},
            processing_time: (Date.now() - startTime) / 1000,
            success: false,
            error: `API Error: ${response.status} - ${errorText}`
          })
        }
      } catch (error) {
        console.error("Land cover processing error:", error)
        newResults.push({
          filename: file.name,
          segmentation_mask_base64: "",
          land_cover_statistics: {},
          processing_time: (Date.now() - startTime) / 1000,
          success: false,
          error: error instanceof Error ? error.message : "Network error occurred"
        })
      }
      
      setCurrentProgress(((i + 1) / files.length) * 100)
    }

    setResults(newResults)
    setProcessing(false)
    setCurrentProgress(0)
  }

  const clearAll = () => {
    setFiles([])
    setResults([])
    setCurrentProgress(0)
    setSelectedMask(null)
  }

  const downloadResults = () => {
    const dataStr = JSON.stringify(results.map(r => ({
      filename: r.filename,
      land_cover_statistics: r.land_cover_statistics,
      processing_time: r.processing_time,
      success: r.success
    })), null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `land-cover-analysis-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadMask = (result: LandCoverResult) => {
    if (!result.segmentation_mask_base64) return
    
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${result.segmentation_mask_base64}`
    link.download = `${result.filename.split('.')[0]}_segmentation_mask.png`
    link.click()
  }

  const getLandCoverColor = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes("forest")) return "bg-green-100 text-green-800 border-green-200"
    if (categoryLower.includes("agricultural") || categoryLower.includes("agriculture")) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (categoryLower.includes("water")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (categoryLower.includes("built") || categoryLower.includes("urban")) return "bg-gray-100 text-gray-800 border-gray-200"
    if (categoryLower.includes("barren") || categoryLower.includes("bare")) return "bg-orange-100 text-orange-800 border-orange-200"
    if (categoryLower.includes("vegetation")) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    return "bg-purple-100 text-purple-800 border-purple-200"
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Satellite Image Upload & Analysis
          </CardTitle>
          <CardDescription>
            Upload satellite imagery for advanced land cover classification using U-Net deep learning models with enhanced water body detection
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
            <Satellite className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop satellite images here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              High-resolution satellite imagery (JPG, PNG up to 50MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="satellite-upload"
            />
            <Button asChild>
              <label htmlFor="satellite-upload" className="cursor-pointer">
                <ImageIcon className="h-4 w-4 mr-2" />
                Select Satellite Images
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Images ({files.length})</h4>
                <div className="flex gap-2">
                  <Button onClick={processImages} disabled={processing} size="sm">
                    {processing ? "Analyzing..." : "Analyze Land Cover"}
                  </Button>
                  <Button variant="outline" onClick={clearAll} size="sm">
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded"></div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 rounded-b truncate">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Processing with U-Net segmentation model...</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(currentProgress)}%)
                </span>
              </div>
              <Progress value={currentProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle>Land Cover Classification Results</CardTitle>
                  <CardDescription>
                    Pixel-level land cover analysis with statistical breakdown from {results.length} image(s)
                  </CardDescription>
                </div>
              </div>
              <Button onClick={downloadResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Satellite className="h-4 w-4 text-primary" />
                    <span className="font-medium">{result.filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        U-Net Segmentation
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>

                {!result.success && result.error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {result.error}
                    </AlertDescription>
                  </Alert>
                )}

                {result.success && Object.keys(result.land_cover_statistics).length > 0 && (
                  <>
                    <Separator />
                    
                    {/* Land Cover Statistics */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <h4 className="font-medium text-sm">Land Cover Distribution</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(result.land_cover_statistics).map(([category, percentage]) => (
                          <div key={category} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm font-medium">{category}</span>
                            <Badge className={getLandCoverColor(category)}>
                              {percentage}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Segmentation Preview */}
                    {result.segmentation_mask_base64 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Segmentation Mask</h4>
                        <div 
                          className="p-4 bg-muted/30 rounded border-2 border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedMask(result.segmentation_mask_base64)}
                        >
                          <div className="flex items-center justify-center">
                            <img 
                              src={`data:image/png;base64,${result.segmentation_mask_base64}`}
                              alt="Segmentation mask"
                              className="max-h-32 rounded border"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground text-center mt-2">
                            Click to view full size
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    Processed in {result.processing_time.toFixed(2)}s
                  </span>
                  <div className="flex gap-2">
                    {result.segmentation_mask_base64 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadMask(result)}
                      >
                        <Satellite className="h-4 w-4 mr-2" />
                        Download Mask
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Full Size Mask Modal */}
      {selectedMask && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMask(null)}
        >
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Segmentation Mask - Full Size</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedMask(null)}>
                Close
              </Button>
            </div>
            <img 
              src={`data:image/png;base64,${selectedMask}`}
              alt="Full size segmentation mask"
              className="w-full h-auto rounded border"
            />
          </div>
        </div>
      )}
    </div>
  )
}
                        