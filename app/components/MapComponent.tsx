// components/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

// Fix Leaflet marker icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  destinationName: string;
  city: string;
}

export default function MapComponent({ 
  center, 
  zoom = 13, 
  destinationName, 
  city 
}: MapComponentProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={defaultIcon}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold text-[#004525]">{destinationName}</h3>
            <p className="text-sm text-[#404942]">{city}</p>
            <Link 
              href={`https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`}
              target="_blank"
              className="text-blue-600 text-sm hover:underline"
            >
              Get Directions
            </Link>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}