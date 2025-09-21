"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button"
import { LayersPanel } from "@/components/map/layers-panel"
import { FiltersPanel } from "@/components/map/FiltersPanel";
import { MapLegend } from "@/components/map/map-legend";
import { Layers, Info, Settings, Download, Loader2 } from "lucide-react"
import { LatLngBounds } from "leaflet"
import api from "@/lib/api"; // Import our Axios instance
import axios from 'axios';

// Dynamically import the map to prevent SSR issues with Leaflet
const MapContainerComponent = dynamic(() => import('./MapContainerComponent').then(mod => mod.MapContainerComponent), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin h-8 w-8" /> <p className="ml-2">Loading Map...</p></div>
});


export function MapInterface() {
  const [viewState, setViewState] = useState({ center: [23.5, 78.9] as [number, number], zoom: 6 });
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);

  const [selectedLayers, setSelectedLayers] = useState({
    claims: true,
    assets: true,
    landUse: false,
  });
  
  const [filters, setFilters] = useState({
    state: "Madhya Pradesh", // Default state
    district: "",
    status: "",
  });

  // State to hold the fetched data
  const [claimsData, setClaimsData] = useState([]);
  const [assetsData, setAssetsData] = useState([]);
  const [landUseData, setLandUseData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleFilterChange = (filterName: string, value: string) => {
    const newValue = value === 'all' ? '' : value;
    // When changing state, reset the district filter
    if (filterName === 'state') {
        setFilters(prev => ({ ...prev, district: '', [filterName]: newValue }));
    } else {
        setFilters(prev => ({ ...prev, [filterName]: newValue }));
    }
  };
  
  // This useEffect hook handles all spatial data fetching
  useEffect(() => {
    // Don't fetch if we don't have map bounds yet
    if (!bounds) return;

    const controller = new AbortController(); // To cancel previous requests

    const fetchData = async () => {
      setIsDataLoading(true);

      const params = new URLSearchParams();
      params.append('bbox', bounds.toBBoxString());
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.status) params.append('status', filters.status);

      try {
        // Fetch all selected layers concurrently
        const requests = [];
        if (selectedLayers.claims) requests.push(api.get(`/api/v1/spatial/claims/?${params.toString()}`, { signal: controller.signal }));
        if (selectedLayers.assets) requests.push(api.get(`/api/v1/spatial/assets/?${params.toString()}`, { signal: controller.signal }));
        if (selectedLayers.landUse) requests.push(api.get(`/api/v1/spatial/land-use/?${params.toString()}`, { signal: controller.signal }));
        
        const responses = await Promise.all(requests);
        
        let responseIndex = 0;
        setClaimsData(selectedLayers.claims ? responses[responseIndex++].data : []);
        setAssetsData(selectedLayers.assets ? responses[responseIndex++].data : []);
        setLandUseData(selectedLayers.landUse ? responses[responseIndex++].data : []);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error("Failed to fetch spatial data:", error);
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();

    // Cleanup function: this will run when dependencies change, canceling the previous request
    return () => {
      controller.abort();
    };

  }, [bounds, filters, selectedLayers]); // Re-fetch when map moves, filters change, or layers are toggled

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-card border-b px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">WebGIS Map Interface</h1>
            <p className="text-sm text-muted-foreground">Interactive spatial analysis and visualization</p>
          </div>
          <div className="flex items-center gap-2">
             {isDataLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
             <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export View
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-card border-r flex flex-col overflow-y-auto">
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Filters</h2>
            </div>
            <FiltersPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Layer Toggles */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Map Layers</h2>
            </div>
            <LayersPanel
              selectedLayers={selectedLayers}
              onLayerToggle={(layer, enabled) => setSelectedLayers((prev) => ({ ...prev, [layer]: enabled }))}
            />
          </div>

          {/* Legend */}
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Legend</h2>
            </div>
            <MapLegend selectedLayers={selectedLayers} />
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainerComponent
            center={viewState.center}
            zoom={viewState.zoom}
            onBoundsChange={setBounds}
            claimsData={claimsData}
            assetsData={assetsData}
            landUseData={landUseData}
            selectedLayers={selectedLayers}
          />
        </div>
      </div>
    </div>
  )
}