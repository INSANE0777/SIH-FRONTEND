"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Award, CheckCircle, Clock, ExternalLink, Users } from "lucide-react"
import type { Village } from "./village-profile-interface"

interface SchemeRecommendation {
  scheme_name: string
  scheme_type: string
  eligibility: "Eligible" | "Partially Eligible" | "Not Eligible"
  description: string
  benefits: string
  application_process: string
  estimated_beneficiaries: number
  priority_score: number
}

interface SchemeRecommendationsProps {
  village: Village
}

export function SchemeRecommendations({ village }: SchemeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchemeRecommendations = async () => {
      setLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/v1/dss/scheme-recommendations/${village.village_name}`)
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.scheme_recommendations)
        } else {
          // Mock data for demonstration
          setRecommendations([
            {
              scheme_name: "PM-KISAN",
              scheme_type: "Agricultural Support",
              eligibility: "Eligible",
              description: "Direct income support to farmer families",
              benefits: "₹6,000 per year in three installments",
              application_process: "Online application through PM-KISAN portal",
              estimated_beneficiaries: 234,
              priority_score: 9.2,
            },
            {
              scheme_name: "MGNREGA",
              scheme_type: "Employment Guarantee",
              eligibility: "Eligible",
              description: "Guaranteed 100 days of wage employment",
              benefits: "Minimum wage employment for rural households",
              application_process: "Registration at Gram Panchayat level",
              estimated_beneficiaries: 456,
              priority_score: 8.8,
            },
            {
              scheme_name: "Pradhan Mantri Awas Yojana",
              scheme_type: "Housing",
              eligibility: "Partially Eligible",
              description: "Housing for all in rural areas",
              benefits: "Financial assistance for house construction",
              application_process: "Application through Common Service Centers",
              estimated_beneficiaries: 89,
              priority_score: 7.5,
            },
            {
              scheme_name: "Swachh Bharat Mission",
              scheme_type: "Sanitation",
              eligibility: "Eligible",
              description: "Clean India Mission for rural sanitation",
              benefits: "Toilet construction incentives",
              application_process: "Through Gram Panchayat and online portal",
              estimated_beneficiaries: 167,
              priority_score: 8.1,
            },
            {
              scheme_name: "National Rural Health Mission",
              scheme_type: "Healthcare",
              eligibility: "Eligible",
              description: "Improving healthcare delivery in rural areas",
              benefits: "Enhanced healthcare infrastructure and services",
              application_process: "Automatic coverage for eligible population",
              estimated_beneficiaries: 2847,
              priority_score: 9.0,
            },
          ])
        }
      } catch (error) {
        console.log("[v0] Scheme recommendations API error:", error)
        // Mock data for demonstration
        setRecommendations([
          {
            scheme_name: "PM-KISAN",
            scheme_type: "Agricultural Support",
            eligibility: "Eligible",
            description: "Direct income support to farmer families",
            benefits: "₹6,000 per year in three installments",
            application_process: "Online application through PM-KISAN portal",
            estimated_beneficiaries: 234,
            priority_score: 9.2,
          },
          {
            scheme_name: "MGNREGA",
            scheme_type: "Employment Guarantee",
            eligibility: "Eligible",
            description: "Guaranteed 100 days of wage employment",
            benefits: "Minimum wage employment for rural households",
            application_process: "Registration at Gram Panchayat level",
            estimated_beneficiaries: 456,
            priority_score: 8.8,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSchemeRecommendations()
  }, [village])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getEligibilityColor = (eligibility: string) => {
    switch (eligibility) {
      case "Eligible":
        return "bg-green-100 text-green-800 border-green-200"
      case "Partially Eligible":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Not Eligible":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Government Scheme Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Personalized scheme recommendations for {village.village_name} based on eligibility criteria
          </p>
        </div>
        <Badge variant="outline">{recommendations.length} schemes identified</Badge>
      </div>

      <div className="space-y-4">
        {recommendations.map((scheme, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{scheme.scheme_name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getEligibilityColor(scheme.eligibility)}>{scheme.eligibility}</Badge>
                  <Badge variant="outline" className={getPriorityColor(scheme.priority_score)}>
                    Priority: {scheme.priority_score}/10
                  </Badge>
                </div>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{scheme.scheme_type}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {scheme.estimated_beneficiaries.toLocaleString()} potential beneficiaries
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{scheme.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Benefits
                  </h4>
                  <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3 text-blue-600" />
                    Application Process
                  </h4>
                  <p className="text-sm text-muted-foreground">{scheme.application_process}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Recommendation based on village demographics and infrastructure assessment
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {scheme.eligibility === "Eligible" && <Button size="sm">Apply Now</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
