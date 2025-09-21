"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, Download, Eye, AlertCircle, Plus, XCircle } from "lucide-react"

// --- TypeScript Interfaces ---

// Matches the structure of your FastAPI backend response
interface AnalysisResult {
  form_type: string;
  extracted_data: {
    claimant_name?: string;
    additional_claimants?: string[];
    spouse_name?: string;
    father_mother_name?: string;
    village?: string;
    additional_villages?: string[];
    district?: string;
    tehsil?: string;
    claim_area?: string;
    [key: string]: any; // Allows for other potential fields
  };
  all_entities: {
    claimant_names: string[];
    spouse_names: string[];
    father_names: string[];
    villages: string[];
    districts: string[];
    tehsils: string[];
    claim_areas: string[];
  };
  confidence: number;
  total_entities_found: number;
  structured_fields: number;
}

interface BackendResponse {
  filename: string;
  status: string;
  analysis_result: AnalysisResult;
  raw_text_preview: string;
  processing_info: {
    model_path: string;
    entities_found: number;
    structured_fields: number;
    confidence: number;
  };
}

// Represents the result object stored in the frontend's state
interface OCRResult {
  filename: string;
  status: string;
  analysis_result: AnalysisResult | null;
  raw_text_preview: string | null;
  processing_time: number;
  success: boolean;
  error?: string;
  filePreviewUrl?: string;
}

// --- API Configuration ---
const API_BASE_URL = "http://localhost:8001"; // Your backend API base URL

// --- Component ---
export function OCRProcessor() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<OCRResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  // Effect to manage object URLs for image previews
  useEffect(() => {
    const newPreviewUrls: Record<string, string> = {};
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        newPreviewUrls[file.name] = URL.createObjectURL(file);
      }
    });

    setPreviewUrls(newPreviewUrls);

    // Cleanup function to revoke URLs when files change or component unmounts
    return () => {
      Object.values(newPreviewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.includes("image") || file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const processDocuments = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setCurrentProgress(0);
    const newResults: OCRResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const startTime = Date.now();
      
      try {
        setCurrentProgress(((i + 0.5) / files.length) * 100);
        
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/analyze-document`, {
          method: "POST",
          body: formData,
        });

        const processingTime = (Date.now() - startTime) / 1000;

        if (response.ok) {
          const result: BackendResponse = await response.json();
          newResults.push({
            filename: file.name,
            status: result.status,
            analysis_result: result.analysis_result,
            raw_text_preview: result.raw_text_preview,
            processing_time: processingTime,
            success: true,
            filePreviewUrl: previewUrls[file.name],
          });
        } else {
          const errorResponse = await response.json();
          newResults.push({
            filename: file.name,
            status: "Failed",
            analysis_result: null,
            raw_text_preview: null,
            processing_time: processingTime,
            success: false,
            error: errorResponse.detail || `API Error: ${response.status}`,
          });
        }
      } catch (error) {
        console.error("OCR processing error:", error);
        newResults.push({
          filename: file.name,
          status: "Failed",
          analysis_result: null,
          raw_text_preview: null,
          processing_time: (Date.now() - startTime) / 1000,
          success: false,
          error: error instanceof Error ? error.message : "An unknown error occurred",
        });
      }
      
      setCurrentProgress(((i + 1) / files.length) * 100);
    }

    setResults(newResults);
    setProcessing(false);
  };

  const createClaimFromOCR = async (result: OCRResult) => {
    if (!result.analysis_result?.extracted_data) {
      alert("Cannot create claim: No extracted data found.");
      return;
    }
    const { extracted_data, form_type, confidence } = result.analysis_result;
    
    // This is a simulation. In a real app, you would post this data
    // to another endpoint like `/api/claims`.
    const claimPayload = {
      source_filename: result.filename,
      form_type,
      confidence,
      claimant: extracted_data.claimant_name || "N/A",
      location: `${extracted_data.village || "N/A"}, ${extracted_data.district || "N/A"}`,
      details: extracted_data,
    };

    console.log("Submitting claim payload:", claimPayload);
    alert(`
      ✅ Claim Creation Simulated!

      A new FRA claim would be created with the following details:
      ----------------------------------------------------
      • Source File: ${claimPayload.source_filename}
      • Form Type: ${claimPayload.form_type}
      • Claimant: ${claimPayload.claimant}
      • Location: ${claimPayload.location}
      • Confidence: ${(confidence * 100).toFixed(1)}%
    `);
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
    setCurrentProgress(0);
  };

  const downloadAllResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            FRA Document Processor
          </CardTitle>
          <CardDescription>
            Upload Forest Rights Act forms (PDF, JPG, PNG) for automated data extraction.
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
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop documents here or click to upload</h3>
            <p className="text-muted-foreground mb-4">
              Supports PDF, JPG, and PNG files.
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected Files ({files.length})</h4>
                <div className="flex gap-2">
                  <Button onClick={processDocuments} disabled={processing} size="sm">
                    {processing ? "Processing..." : `Process ${files.length} Document(s)`}
                  </Button>
                  <Button variant="outline" onClick={clearAll} size="sm">
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                    <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Analyzing documents with OCR and NER...</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(currentProgress)}%)
                </span>
              </div>
              <Progress value={currentProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Area */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle>Processing Results</CardTitle>
                  <CardDescription>
                    Analysis complete for {results.length} document(s).
                  </CardDescription>
                </div>
              </div>
              <Button onClick={downloadAllResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All Results (JSON)
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                {/* Result Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{result.filename}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.success && result.analysis_result ? (
                      <>
                        <Badge variant="outline">{result.analysis_result.form_type}</Badge>
                        <Badge
                          className={
                            result.analysis_result.confidence > 0.7
                              ? "bg-green-100 text-green-800"
                              : result.analysis_result.confidence > 0.4
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {(result.analysis_result.confidence * 100).toFixed(0)}% Confidence
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Processing Failed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {!result.success && result.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                )}

                {/* Success Display */}
                {result.success && result.analysis_result && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                       {/* Extracted Data Section */}
                       {Object.keys(result.analysis_result.extracted_data).length > 0 ? (
                        <div className="space-y-3">
                          <h5 className="font-medium text-sm text-gray-700">Extracted Information</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(result.analysis_result.extracted_data).map(([key, value]) => {
                              const displayKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                              const displayValue = Array.isArray(value) ? value.join(', ') : value;
                              const hasValue = displayValue && String(displayValue).trim() !== "";
                              
                              return (
                                <div key={key} className={`flex justify-between items-center p-2 rounded-lg border text-sm ${
                                  hasValue ? "bg-green-50/50 border-green-200" : "bg-gray-50/50 border-gray-200"
                                }`}>
                                  <span className="font-medium text-gray-600">{displayKey}:</span>
                                  <span className={`font-mono text-right ${hasValue ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                                    {hasValue ? String(displayValue) : 'Not found'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                           <AlertCircle className="h-4 w-4" />
                           <AlertDescription>No structured data could be extracted. The document may be empty, blurry, or unsupported.</AlertDescription>
                        </Alert>
                      )}

                       {/* Document Preview */}
                      {result.filePreviewUrl && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Document Preview</h5>
                          <div className="flex justify-center p-2 border rounded-lg bg-gray-50">
                            <img 
                              src={result.filePreviewUrl}
                              alt={`Preview of ${result.filename}`}
                              className="max-h-60 max-w-full object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Result Footer with Actions */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t gap-2">
                  <span className="text-xs text-muted-foreground">
                    Processed in {result.processing_time.toFixed(2)}s
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const detailsWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                        if (detailsWindow && result.analysis_result) {
                          const { extracted_data, all_entities, form_type, confidence } = result.analysis_result;
                          const extractedHtml = Object.entries(extracted_data)
                            .map(([key, value]) => `<tr><td>${key.replace(/_/g, " ")}</td><td>${Array.isArray(value) ? value.join(', ') : value}</td></tr>`)
                            .join('');
                          const allEntitiesHtml = Object.entries(all_entities)
                            .map(([key, value]) => `<tr><td>${key.replace(/_/g, " ")}</td><td>${value.join(', ') || '<i>None</i>'}</td></tr>`)
                            .join('');

                          detailsWindow.document.write(`
                            <html>
                              <head>
                                <title>Details: ${result.filename}</title>
                                <style>
                                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; line-height: 1.6; }
                                  h2, h3 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                                  table { border-collapse: collapse; width: 100%; margin-top: 15px; }
                                  th, td { border: 1px solid #ddd; text-align: left; padding: 8px; vertical-align: top; }
                                  th { background-color: #f8f8f8; text-transform: capitalize; }
                                  pre { background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px; white-space: pre-wrap; word-wrap: break-word; font-size: 12px; }
                                </style>
                              </head>
                              <body>
                                <h2>Analysis Details for ${result.filename}</h2>
                                <p><strong>Form Type:</strong> ${form_type}</p>
                                <p><strong>Confidence:</strong> ${(confidence * 100).toFixed(1)}%</p>
                                
                                <h3>Structured Data (Final Output)</h3>
                                <table><tr><th>Field</th><th>Value</th></tr>${extractedHtml}</table>
                                
                                <h3>All Detected Entities (Raw NER)</h3>
                                <table><tr><th>Entity Type</th><th>Values Found</th></tr>${allEntitiesHtml}</table>

                                <h3>Raw OCR Text</h3>
                                <pre>${result.raw_text_preview || "No raw text available."}</pre>
                              </body>
                            </html>
                          `);
                          detailsWindow.document.close();
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {result.success && result.analysis_result && (
                      <Button
                        onClick={() => createClaimFromOCR(result)}
                        size="sm"
                        disabled={result.analysis_result.structured_fields < 3}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Claim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}