"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RecommendationResults } from "./recommendation-results" // Reusable results component

export function ClaimIdRecommender() {
    const [claimId, setClaimId] = useState("");
    const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!claimId.trim()) return;
        
        setSubmittedClaimId(claimId);
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            // We use the AI-powered endpoint for the best recommendations
            const response = await fetch(`http://127.0.0.1:8000/api/v1/dss/ai-scheme-recommendations/${claimId}`);
            
            if (!response.ok) {
                const errData = await response.json().catch(() => null); // Try to parse error detail
                throw new Error(errData?.detail || `API Error: ${response.statusText}`);
            }
            
            const data = await response.json();
            setResults(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search by Beneficiary ID</CardTitle>
                    <CardDescription>
                        Enter an existing Beneficiary / Claim ID to fetch personalized scheme recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            placeholder="e.g., FRA-OCR-1a2b3c4d"
                            value={claimId}
                            onChange={(e) => setClaimId(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? "Searching..." : "Get Recommendations"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <RecommendationResults
                title={submittedClaimId ? `Results for ID: ${submittedClaimId}` : ""}
                results={results}
                loading={loading}
                error={error}
            />
        </div>
    );
}