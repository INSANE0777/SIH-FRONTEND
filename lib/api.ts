import axios from 'axios';
import { LatLngBounds } from 'leaflet';

export const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// A function to fetch all spatial data based on bounds and filters
export const fetchSpatialData = async (bounds: LatLngBounds, filters: any, signal: AbortSignal) => {
  const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  
  const params = { bbox, ...filters };
  // Clean up empty filters to avoid sending them in the URL
  Object.keys(params).forEach(key => (params[key] === null || params[key] === '') && delete params[key]);

  try {
    const claimsRequest = api.get(`/api/v1/spatial/claims/`, { params, signal });
    const assetsRequest = api.get(`/api/v1/spatial/assets/`, { params, signal });
    const landUseRequest = api.get(`/api/v1/spatial/land-use/`, { params, signal });

    const [claimsRes, assetsRes, landUseRes] = await Promise.all([claimsRequest, assetsRequest, landUseRequest]);

    // The backend now returns {data: [...], count: X}
    return {
      claims: claimsRes.data.data.filter(d => d.latitude && d.longitude),
      assets: assetsRes.data.data.filter(d => d.latitude && d.longitude),
      landUse: landUseRes.data.data.filter(d => d.latitude && d.longitude),
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Data fetch request canceled.');
    } else {
      console.error("Error fetching spatial data:", error);
    }
    // Return empty arrays on error to prevent crashes
    return { claims: [], assets: [], landUse: [] };
  }
};