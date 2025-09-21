"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Droplets, Zap, GraduationCap, Heart, AlertTriangle } from "lucide-react"
import type { Village } from "./village-profile-interface"

interface InterventionPriority {
  intervention_type: string
  priority_score: number
  deficit_percentage: number
  estimated_cost: string
  timeline: string
  expected_impact: string
  beneficiaries: number
}

interface InterventionPriorityProps {
  village: Village
}

export function InterventionPriority({ village }: InterventionPriorityProps) {
  const [priorities, setPriorities] = useState<InterventionPriority[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInterventionPriorities = async () => {
      setLoading(true)
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `/api/v1/dss/intervention-priority?village=${encodeURIComponent(village.village_name)}`,
        )
        if (response.ok) {
          const data = await response.json()
          setPriorities(data.priority_interventions)
        } else {
          // Mock data for demonstration
          setPriorities([
            {
              intervention_type: "Water Infrastructure",
              priority_score: 9.2,
              deficit_percentage: 21.5,
              estimated_cost: "₹12.5 Lakhs",
              timeline: "6-8 months",
              expected_impact: "Improved water access for 78% of households",
              beneficiaries: 542,
            },
            {
              intervention_type: "Road Connectivity",
              priority_score: 8.7,
              deficit_percentage: 34.6,
              estimated_cost: "₹25.8 Lakhs",
              timeline: "12-15 months",
              expected_impact: "All-weather road access to main highway",
              beneficiaries: 2847,
            },
            {
              intervention_type: "Healthcare Facilities",
              priority_score: 8.1,
              deficit_percentage: 45.2,
              estimated_cost: "₹18.2 Lakhs",
              timeline: "8-10 months",
              expected_impact: "Primary health center with 24/7 services",
              beneficiaries: 2847,
            },
            {
              intervention_type: "Education Infrastructure",
              priority_score: 7.4,
              deficit_percentage: 28.9,
              estimated_cost: "₹15.6 Lakhs",
              timeline: "10-12 months",
              expected_impact: "Upgraded school facilities and digital classroom",
              beneficiaries: 456,
            },
            {
              intervention_type: "Electricity Grid",
              priority_score: 6.8,
              deficit_percentage: 10.8,
              estimated_cost: "₹8.9 Lakhs",
              timeline: "4-6 months",
              expected_impact: "Reliable power supply for remaining households",
              beneficiaries: 89,
            },
          ])
        }
      } catch (error) {
        console.log("[v0] Intervention priority API error:", error)
        // Mock data for demonstration
        setPriorities([
          {
            intervention_type: "Water Infrastructure",
            priority_score: 9.2,
            deficit_percentage: 21.5,
            estimated_cost: "₹12.5 Lakhs",
            timeline: "6-8 months",
            expected_impact: "Improved water access for 78% of households",
            beneficiaries: 542,
          },
          {
            intervention_type: "Road Connectivity",
            priority_score: 8.7,
            deficit_percentage: 34.6,
            estimated_cost: "₹25.8 Lakhs",
            timeline: "12-15 months",
            expected_impact: "All-weather road access to main highway",
            beneficiaries: 2847,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchInterventionPriorities()
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

  const getInterventionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "water infrastructure":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "electricity grid":
        return <Zap className="h-5 w-5 text-yellow-500" />
      case "education infrastructure":
        return <GraduationCap className="h-5 w-5 text-purple-500" />
      case "healthcare facilities":
        return <Heart className="h-5 w-5 text-red-500" />
      default:
        return <TrendingUp className="h-5 w-5 text-primary" />
    }
  }

  const getPriorityLevel = (score: number) => {
    if (score >= 9) return { label: "Critical", color: "bg-red-100 text-red-800 border-red-200" }
    if (score >= 7) return { label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" }
    if (score >= 5) return { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    return { label: "Low", color: "bg-green-100 text-green-800 border-green-200" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Infrastructure Intervention Priorities</h3>
          <p className="text-sm text-muted-foreground">
            Data-driven recommendations for infrastructure development in {village.village_name}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {priorities.filter((p) => p.priority_score >= 8).length} high priority
        </Badge>
      </div>

      <div className="space-y-4">
        {priorities.map((intervention, index) => {
          const priorityLevel = getPriorityLevel(intervention.priority_score)
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getInterventionIcon(intervention.intervention_type)}
                    <CardTitle className="text-lg">{intervention.intervention_type}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={priorityLevel.color}>{priorityLevel.label} Priority</Badge>
                    <Badge variant="outline">Score: {intervention.priority_score}/10</Badge>
                  </div>
                </div>
                <CardDescription>
                  {intervention.deficit_percentage}% infrastructure deficit •{" "}
                  {intervention.beneficiaries.toLocaleString()} beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Infrastructure Gap</span>
                    <span>{intervention.deficit_percentage}%</span>
                  </div>
                  <Progress value={intervention.deficit_percentage} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Estimated Cost</h4>
                    <p className="text-sm text-muted-foreground">{intervention.estimated_cost}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Timeline</h4>
                    <p className="text-sm text-muted-foreground">{intervention.timeline}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Beneficiaries</h4>
                    <p className="text-sm text-muted-foreground">
                      {intervention.beneficiaries.toLocaleString()} people
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Expected Impact</h4>
                  <p className="text-sm text-muted-foreground">{intervention.expected_impact}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
