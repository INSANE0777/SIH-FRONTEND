"use client"

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/api"; // Import the new Axios instance

export function FiltersPanel({ filters, onFilterChange }) {
  const [states, setStates] = useState<string[]>([]);

  // Fetch available states from your backend when the component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/api/v1/states');
        setStates(response.data.states || []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };
    fetchStates();
  }, []); // Empty dependency array means this runs only once on mount

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="state-filter">State</Label>
        <Select value={filters.state} onValueChange={(value) => onFilterChange('state', value)}>
          <SelectTrigger id="state-filter">
            <SelectValue placeholder="Select a state..." />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="district-filter">District (Optional)</Label>
        <input
            id="district-filter"
            className="w-full p-2 border rounded bg-background"
            placeholder="Enter district name to filter..."
            value={filters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
        />
      </div>
       <div>
        <Label htmlFor="status-filter">Claim Status (Optional)</Label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}