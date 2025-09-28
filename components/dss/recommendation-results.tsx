import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Loader2 } from "lucide-react"

interface Recommendation {
  scheme_name: string
  eligibility_status: string
  rationale: string
  confidence_score: number
  nearest_match_similarity?: number
}

interface ResultsProps {
  title: string;
  results: { recommendations: Recommendation[] } | null;
  loading: boolean;
  error: string | null;
}

export function RecommendationResults({ title, results, loading, error }: ResultsProps) {

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading Recommendations...</span>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        An Error Occurred
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please check the Beneficiary ID and try again, or verify the backend service is running.
                    </p>
                </CardContent>
            </Card>
        )
    }

    if (!results) {
        // Don't show anything if there are no results and no error/loading state
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    The following schemes are recommended based on the provided data.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {results.recommendations.length > 0 ? (
                    results.recommendations.map((rec, index) => (
                        <Card key={index} className="shadow-sm">
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
                                        <span>Similarity to Match: {(rec.nearest_match_similarity * 100).toFixed(1)}%</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground p-4">No specific scheme recommendations could be generated for this profile.</p>
                )}
            </CardContent>
        </Card>
    );
}