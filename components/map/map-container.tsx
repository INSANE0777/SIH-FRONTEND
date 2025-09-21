import { MapContainer, TileLayer } from 'react-leaflet';
import { MapEvents } from './MapEvents';
import { MapLayers } from './MapLayers';
import 'leaflet/dist/leaflet.css';

export function MapContainerComponent({
  center, zoom, onBoundsChange,
  claimsData, assetsData, landUseData, selectedLayers
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onBoundsChange={onBoundsChange} />
      <MapLayers
        claims={claimsData}
        assets={assetsData}
        landUse={landUseData}
        selectedLayers={selectedLayers}
      />
    </MapContainer>
  );
}