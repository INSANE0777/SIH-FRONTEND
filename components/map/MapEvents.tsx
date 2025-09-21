import { useMapEvents } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

interface MapEventsProps {
  onBoundsChange: (bounds: LatLngBounds) => void;
}

export function MapEvents({ onBoundsChange }: MapEventsProps) {
  const map = useMapEvents({
    // This event fires after any zoom or pan movement
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
  });

  // Initial load
  if (map && !map.getBounds().toBBoxString()) {
      setTimeout(() => onBoundsChange(map.getBounds()), 200);
  }

  return null;
}