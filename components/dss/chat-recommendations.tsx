"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"
import { RecommendationResults } from "./recommendation-results"

interface ChatResponse {
    user_query: string;
    features_extracted: Record<string, any>;
    recommendations: any[];
}

export function ChatRecommender() {
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState<ChatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const apiResponse = await fetch('http://127.0.0.1:8000/api/v1/dss/chat-recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (!apiResponse.ok) throw new Error(`API Error: ${apiResponse.statusText}`);
            const data = await apiResponse.json();
            setResponse(data);

        } catch (err: any) {
            setError(err.message || "Failed to get recommendations.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Chat Assistant</CardTitle>
                    <CardDescription>
                        Describe a person in plain language (e.g., "a 30 year old woman farmer with 2 children") to get recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input placeholder="Enter your description here..." value={query} onChange={(e) => setQuery(e.target.value)} disabled={loading} />
                        <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : <Send className="h-4 w-4" />}</Button>
                    </form>
                </CardContent>
            </Card>

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">AI Analysis</CardTitle>
                        <CardDescription>The AI extracted the following features from your query:</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {Object.entries(response.features_extracted).map(([key, value]) => (
                            <Badge key={key} variant="secondary">
                                <span className="font-normal capitalize mr-1">{key.replace(/_/g, ' ')}:</span> {String(value)}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>
            )}

            <RecommendationResults title="AI Chat Recommendations" results={response} loading={loading} error={error} />
        </div>
    );
}