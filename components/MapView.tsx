// src/components/MapView.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl, LayerGroup, GeoJSON, useMap, Pane } from 'react-leaflet';
import axios from 'axios';
import { Typography, Box, CircularProgress, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Interface definitions (no changes here) ---
interface Claim {
  claim_id: number;
  latitude: number;
  longitude: number;
  status: 'Approved' | 'Rejected' | 'Pending';
  claimant_name: string;
  village: string;
  claim_type: string;
}
interface LandUse {
  id: number;
  latitude: number;
  longitude: number;
  land_use_class: string;
  district: string;
  area_ha: number;
}
interface Asset {
  asset_id: number;
  latitude: number;
  longitude: number;
  asset_type: string;
  village: string;
  condition: string;
}
interface Filters {
  state: string; // State is no longer optional
  district: string;
  village: string;
  status: string;
}
interface MapDataHandlerProps {
  filters: Filters;
  setClaims: React.Dispatch<React.SetStateAction<Claim[]>>;
  setLandUse: React.Dispatch<React.SetStateAction<LandUse[]>>;
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL = 'http://127.0.0.1:8000';
const MADHYA_PRADESH_CENTER: LatLngExpression = [23.47, 78.96]; // Specific center for MP

// --- MapDataHandler component (no changes here) ---
function MapDataHandler({ filters, setClaims, setLandUse, setAssets, setLoading }: MapDataHandlerProps) {
  const map = useMap();

  const fetchData = useCallback(() => {
    // Don't fetch if state isn't set (it will be, but this is a safeguard)
    if (!filters.state) {
      setClaims([]);
      setLandUse([]);
      setAssets([]);
      return;
    }
    setLoading(true);
    const bounds = map.getBounds();
    const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

    const params: any = { bbox, ...filters };
    Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);

    const claimsRequest = axios.get<Claim[]>(`${API_BASE_URL}/api/v1/spatial/claims/`, { params });
    const landUseRequest = axios.get<LandUse[]>(`${API_BASE_URL}/api/v1/spatial/land-use/`, { params });
    const assetsRequest = axios.get<Asset[]>(`${API_BASE_URL}/api/v1/spatial/assets/`, { params });

    Promise.all([claimsRequest, landUseRequest, assetsRequest])
      .then(([claimsRes, landUseRes, assetsRes]) => {
        setClaims(claimsRes.data.filter(d => d.latitude && d.longitude));
        setLandUse(landUseRes.data.filter(d => d.latitude && d.longitude));
        setAssets(assetsRes.data.filter(d => d.latitude && d.longitude));
      })
      .catch(error => console.error("Error fetching spatial data:", error))
      .finally(() => setLoading(false));
  }, [map, filters, setClaims, setLandUse, setAssets, setLoading]);

  useEffect(() => {
    fetchData();
    map.on('moveend', fetchData);
    return () => { map.off('moveend', fetchData); };
  }, [map, fetchData]);

  return null;
}

function MapView() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [landUse, setLandUse] = useState<LandUse[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [districtBoundaries, setDistrictBoundaries] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [textFilters, setTextFilters] = useState({ district: '', village: '', status: '' });
  
  // FIX: Set the initial active state to "Madhya Pradesh"
  const [activeFilters, setActiveFilters] = useState<Filters>({
    state: 'Madhya Pradesh',
    district: '',
    village: '',
    status: ''
  });

  // FIX: Set the initial map center to Madhya Pradesh
  const [center, setCenter] = useState<LatLngExpression>(MADHYA_PRADESH_CENTER);
  const [locationFound, setLocationFound] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/v1/states`)
      .then(response => {
        setAvailableStates(response.data.states || []);
      })
      .catch(error => {
        console.error("Failed to fetch list of states:", error);
      });
  }, []);

  useEffect(() => {
    // This will try to get the user's location and override the default center if successful
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setLocationFound(true);
      },
      (error) => {
        console.error("Geolocation error: ", error, ". Using default location.");
        setLocationFound(true); // Allow map to render even if geolocation fails
      }
    );
  }, []);

  useEffect(() => {
    const filesToLoad = ['madhya_pradesh_districts.geojson', 'odisha.geojson', 'telangana.geojson', 'tripura.geojson'];
    const promises = filesToLoad.map(file => axios.get(`/${file}`));

    Promise.all(promises)
      .then(responses => {
        const masterGeoJSON: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
        responses.forEach(response => {
          if (response.data && response.data.features) {
            masterGeoJSON.features.push(...response.data.features);
          }
        });
        setDistrictBoundaries(masterGeoJSON);
      })
      .catch(error => {
        console.error("Error loading or combining one or more GeoJSON files:", error);
      });
  }, []);
  
  const handleTextFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextFilters({ ...textFilters, [e.target.name]: e.target.value });
  };
  
  const handleStateChange = (event: SelectChangeEvent) => {
    const selectedState = event.target.value;
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      state: selectedState,
    }));
  };

  const applyTextFilters = () => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      ...textFilters,
    }));
  };
  
  const getStatusColor = (status: string) => (status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange');
  const getLandUseColor = (type: string) => (type?.includes('Forest') ? '#228B22' : type?.includes('Agricultural') ? '#FFD700' : '#A9A9A9');
  const getAssetColor = (type: string) => (type?.toLowerCase().includes('school') ? '#00008B' : type?.toLowerCase().includes('health') ? '#DC143C' : type?.toLowerCase().includes('water') ? '#1E90FF' : '#4B0082');
  const boundaryStyle = { color: "#ff7800", weight: 2, opacity: 0.8, fillOpacity: 0.1, interactive: false };

  if (!locationFound) {
    return <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '70vh' }}><CircularProgress /><Typography sx={{ ml: 2 }}>Initializing Map...</Typography></Box>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>Interactive GIS Atlas</Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>Filters:</Typography>
          
          <FormControl size="small" sx={{ flex: 1, minWidth: '180px' }}>
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
              labelId="state-select-label"
              value={activeFilters.state} // No || '' needed, as state will always have a value
              label="State"
              onChange={handleStateChange}
            >
              {/* FIX: Removed the "All States" MenuItem */}
              {availableStates.map((stateName) => (
                <MenuItem key={stateName} value={stateName}>
                  {stateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="District" name="district" value={textFilters.district} onChange={handleTextFilterChange} size="small" sx={{ flex: 1, minWidth: '150px' }} />
          <TextField label="Village" name="village" value={textFilters.village} onChange={handleTextFilterChange} size="small" sx={{ flex: 1, minWidth: '150px' }} />
          <TextField label="Claim Status" name="status" value={textFilters.status} onChange={handleTextFilterChange} size="small" sx={{ flex: 1, minWidth: '150px' }} />
          <Button variant="contained" onClick={applyTextFilters}>Apply Filters</Button>
          {loading && <CircularProgress size={24} />}
        </Box>
      </Paper>

      <Box sx={{ height: '70vh', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
        <MapContainer key={center.toString()} center={center} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <Pane name="boundaries" style={{ zIndex: 450 }} />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <MapDataHandler filters={activeFilters} setClaims={setClaims} setLandUse={setLandUse} setAssets={setAssets} setLoading={setLoading} />
          
          <LayersControl position="topright">
            {districtBoundaries && <LayersControl.Overlay checked name="District Boundaries"><GeoJSON data={districtBoundaries} style={boundaryStyle} pane="boundaries" /></LayersControl.Overlay>}
            
            <LayersControl.Overlay checked name="FRA Claims">
              <LayerGroup>{claims.map((claim: Claim) => (<CircleMarker key={`claim-${claim.claim_id}`} center={[claim.latitude, claim.longitude]} radius={6} pathOptions={{ color: getStatusColor(claim.status), fillColor: getStatusColor(claim.status), fillOpacity: 0.8 }}><Popup><strong>Claimant:</strong> {claim.claimant_name}<br /><strong>Village:</strong> {claim.village}<br /><strong>Status:</strong> {claim.status}<br /><strong>Type:</strong> {claim.claim_type}</Popup></CircleMarker>))}</LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Land Use Points">
              <LayerGroup>{landUse.map((lu: LandUse, index: number) => (<CircleMarker key={`lu-${lu.id || index}`} center={[lu.latitude, lu.longitude]} radius={4} pathOptions={{ color: getLandUseColor(lu.land_use_class), fillColor: getLandUseColor(lu.land_use_class), fillOpacity: 0.6 }}><Popup><strong>Type:</strong> {lu.land_use_class}<br /><strong>District:</strong> {lu.district}<br /><strong>Area (Ha):</strong> {lu.area_ha}</Popup></CircleMarker>))}</LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Community Assets">
              <LayerGroup>{assets.map((asset: Asset) => (<CircleMarker key={`asset-${asset.asset_id}`} center={[asset.latitude, asset.longitude]} radius={5} pathOptions={{ color: getAssetColor(asset.asset_type), fillColor: getAssetColor(asset.asset_type), fillOpacity: 0.9 }}><Popup><strong>Asset:</strong> {asset.asset_type}<br /><strong>Village:</strong> {asset.village}<br /><strong>Condition:</strong> {asset.condition}</Popup></CircleMarker>))}</LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </Box>
    </>
  );
}

export default MapView;