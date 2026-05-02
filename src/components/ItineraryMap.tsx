import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CountrySuggestion } from '../types';

// Fix for Leaflet marker icons in React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  itinerary: CountrySuggestion['itinerary'];
}

export function ItineraryMap({ itinerary }: Props) {
  const validPoints = itinerary.filter(item => item.coordinates);
  
  if (validPoints.length === 0) return null;

  const center = validPoints[0].coordinates!;
  const polylinePoints = validPoints.map(p => [p.coordinates!.lat, p.coordinates!.lng] as [number, number]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 glass-surface z-10">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#000' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {validPoints.map((item, idx) => (
          <Marker 
            key={idx} 
            position={[item.coordinates!.lat, item.coordinates!.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h4 className="font-bold text-gray-900">Day {item.day}: {item.activity}</h4>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <Polyline 
          positions={polylinePoints} 
          color="#fff" 
          weight={2} 
          dashArray="5, 10" 
          opacity={0.5} 
        />
      </MapContainer>
    </div>
  );
}
