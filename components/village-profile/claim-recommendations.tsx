"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Cpu } from "lucide-react"

interface Recommendation {
  scheme_name: string
  eligibility_status: string
  rationale: string
  confidence_score: number
  nearest_match_similarity?: number
}

interface RecommendationsResponse {
  subject_id: string
  recommendations: Recommendation[]
}

interface ClaimRecommendationsProps {
  claimId: string
}

export function ClaimRecommendations({ claimId }: ClaimRecommendationsProps) {
  const [ruleRecs, setRuleRecs] = useState<RecommendationsResponse | null>(null)
  const [aiRecs, setAiRecs] = useState<RecommendationsResponse | null>(null)
  const [loading, setLoading] = useState({ rule: false, ai: false })
  const [activeTab, setActiveTab] = useState("rule")

  // This useEffect resets state when the claimId changes
  useEffect(() => {
    setRuleRecs(null);
    setAiRecs(null);
    setActiveTab('rule'); // Default to rule tab
  }, [claimId]);

  useEffect(() => {
    if (!claimId) return

    const fetchRecommendations = async (type: 'rule' | 'ai') => {
      setLoading(prev => ({ ...prev, [type]: true }))
      const endpoint = type === 'rule'
        ? `http://122.160.55.196:8000/api/v1/dss/scheme-recommendations/${claimId}`
        : `http://122.160.55.196:8000/api/v1/dss/ai-scheme-recommendations/${claimId}`;

      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          if (type === 'rule') setRuleRecs(data)
          else setAiRecs(data)
        } else {
          console.error(`Failed to fetch ${type} recommendations`)
        }
      } catch (error) {
        console.error(`API error fetching ${type} recommendations:`, error)
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }))
      }
    }

    if (activeTab === 'rule' && !ruleRecs) fetchRecommendations('rule')
    if (activeTab === 'ai' && !aiRecs) fetchRecommendations('ai')

  }, [claimId, activeTab, ruleRecs, aiRecs])

  const renderRecommendations = (data: RecommendationsResponse | null, isLoading: boolean) => {
    if (isLoading) return <p className="text-center text-muted-foreground p-4">Loading recommendations...</p>
    if (!data || data.recommendations.length === 0) return <p className="text-center text-muted-foreground p-4">No recommendations available.</p>

    return (
      <div className="space-y-4">
        {data.recommendations.map((rec, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base">
                <span>{rec.scheme_name}</span>
                <Badge variant={rec.eligibility_status === 'Eligible' ? 'default' : 'secondary'}>
                  {rec.eligibility_status}
                </Badge>
              </CardTitle>
              <CardDescription>{rec.rationale}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Confidence: {(rec.confidence_score * 100).toFixed(0)}%</span>
                {rec.nearest_match_similarity != null && (
                  <span>Similarity: {(rec.nearest_match_similarity * 100).toFixed(1)}%</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
       <CardHeader>
          <CardTitle>Scheme Recommendations</CardTitle>
          <CardDescription>Eligibility analysis for claim ID: {claimId}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rule" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Rule-Based
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" /> AI-Powered
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rule" className="mt-4">
            {renderRecommendations(ruleRecs, loading.rule)}
          </TabsContent>
          <TabsContent value="ai" className="mt-4">
            {renderRecommendations(aiRecs, loading.ai)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}