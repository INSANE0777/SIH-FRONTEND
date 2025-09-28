"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RecommendationResults } from "./recommendation-results"

const initialFormData = {
    age: '',
    gender: 'Male',
    tribal_group: 'Gond',
    village: 'Devigarh',
    claim_area_ha: '',
    total_assets: '',
    family_members: '',
};

export function ManualInputRecommender() {
    const [formData, setFormData] = useState(initialFormData);
    const [results, setResults] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults(null);

        const profile = {
            ...formData,
            age: Number(formData.age) || 0,
            claim_area_ha: parseFloat(formData.claim_area_ha) || 0,
            total_assets: Number(formData.total_assets) || 0,
            family_members: Number(formData.family_members) || 0,
        };

        try {
            // NOTE: Ensure your backend has the `/recommend-by-profile` endpoint added.
            const response = await fetch('http://127.0.0.1:8000/api/v1/dss/ai_recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            setResults(data);

        } catch (err: any) {
            setError(err.message || "Failed to get recommendations.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create a Beneficiary Profile</CardTitle>
                    <CardDescription>
                        Fill in the details to generate AI-powered recommendations for a hypothetical beneficiary.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required /></div>
                            <div className="space-y-2"><Label htmlFor="gender">Gender</Label><Select name="gender" value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label htmlFor="family_members">Family Members</Label><Input id="family_members" name="family_members" type="number" value={formData.family_members} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="village">Village</Label><Input id="village" name="village" value={formData.village} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="claim_area_ha">Claim Area (Hectares)</Label><Input id="claim_area_ha" name="claim_area_ha" type="number" step="0.1" value={formData.claim_area_ha} onChange={handleChange} /></div>
                            <div className="space-y-2"><Label htmlFor="total_assets">Total Assets (INR)</Label><Input id="total_assets" name="total_assets" type="number" value={formData.total_assets} onChange={handleChange} /></div>
                        </div>
                        <Button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Recommendations'}</Button>
                    </form>
                </CardContent>
            </Card>

            <RecommendationResults title="Generated Recommendations" results={results} loading={loading} error={error} />
        </div>
    );
}