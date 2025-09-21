import { Marker, Popup, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define custom icons
const claimIcon = new Icon({
  iconUrl: '/claim-icon.svg', // You'll need to create this SVG icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const assetIcon = new Icon({
  iconUrl: '/asset-icon.svg', // And this one
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper to format popup content
const createPopupContent = (item: any) => {
  let content = '';
  for (const [key, value] of Object.entries(item)) {
    content += `<strong>${key.replace(/_/g, ' ')}:</strong> ${value}<br/>`;
  }
  return content;
};


export function MapLayers({ claims, assets, landUse, selectedLayers }) {
  return (
    <>
      {/* Claims Layer */}
      {selectedLayers.claims && claims?.map((claim) => (
        <Marker key={claim.claim_id} position={[claim.latitude, claim.longitude]} icon={claimIcon}>
          <Popup>
            <h4>FRA Claim</h4>
            {createPopupContent(claim)}
          </Popup>
        </Marker>
      ))}

      {/* Assets Layer */}
      {selectedLayers.assets && assets?.map((asset) => (
        <Marker key={asset.asset_id} position={[asset.latitude, asset.longitude]} icon={assetIcon}>
          <Popup>
            <h4>Community Asset</h4>
            {createPopupContent(asset)}
          </Popup>
        </Marker>
      ))}

      {/* Land Use Layer */}
      {selectedLayers.landUse && landUse?.map((point) => (
        <CircleMarker
          key={point.pixel_id}
          center={[point.latitude, point.longitude]}
          radius={3}
          pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.7 }}
        >
           <Popup>
            <h4>Land Use Point</h4>
            {createPopupContent(point)}
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}