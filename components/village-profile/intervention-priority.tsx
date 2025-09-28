"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Droplets, Heart, GraduationCap } from "lucide-react"
import type { Village } from "./village-profile-interface"

interface PriorityLocation {
  village: string
  district: string
  [key: string]: any // To accommodate different response fields like 'water_source'
}

interface InterventionPriorityProps {
  village: Village
}

export function InterventionPriority({ village }: InterventionPriorityProps) {
  const [priorityData, setPriorityData] = useState<Record<string, PriorityLocation[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("water")

  const interventionTypes = ["water", "education", "health"]

  useEffect(() => {
    const fetchInterventionPriority = async (type: string) => {
      if (!village || priorityData[type]) return // Don't refetch if data exists

      setLoading(prev => ({ ...prev, [type]: true }))
      try {
        // API call to the backend endpoint for intervention priorities
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/dss/intervention-priority?state=${encodeURIComponent(village.state)}&intervention_type=${type}`,
        )
        if (response.ok) {
          const data = await response.json()
          setPriorityData(prev => ({ ...prev, [type]: data.priority_locations || [] }))
        } else {
          console.error(`Failed to fetch ${type} priority:`, response.statusText)
        }
      } catch (error) {
        console.error(`API error fetching ${type} priority:`, error)
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }))
      }
    }

    fetchInterventionPriority(activeTab)
  }, [village, activeTab, priorityData])

  const renderIcon = (type: string) => {
    if (type === 'water') return <Droplets className="h-4 w-4" />;
    if (type === 'education') return <GraduationCap className="h-4 w-4" />;
    if (type === 'health') return <Heart className="h-4 w-4" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>State-Level Intervention Priorities</CardTitle>
        <CardDescription>
          Top 10 priority locations for infrastructure development in {village.state}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {interventionTypes.map(type => (
              <TabsTrigger key={type} value={type} className="capitalize flex items-center gap-2">
                {renderIcon(type)}
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          {interventionTypes.map(type => (
            <TabsContent key={type} value={type} className="mt-4">
              {loading[type] ? (
                <p>Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Deficit Indicator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priorityData[type]?.map((loc, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{loc.village}</TableCell>
                        <TableCell>{loc.district}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {loc.water_source || loc.primary_school || loc.health_center}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}