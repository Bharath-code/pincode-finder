import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issues with webpack/vite
// Using local public assets for better control and potential optimization
const iconUrl = '/images/leaflet/marker-icon.png';
const shadowUrl = '/images/leaflet/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    lat: number;
    lon: number;
    displayName: string;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom(), {
        animate: true,
    });
    return null;
}

export function MapView({ lat, lon, displayName }: MapProps) {
    return (
        <div className="h-full w-full bg-secondary/30 relative">
             <MapContainer 
                center={[lat, lon]} 
                zoom={13} 
                scrollWheelZoom={false} 
                className="h-full w-full z-0 grayscale-[0.5] hover:grayscale-0 transition-all duration-500"
            >
                <ChangeView center={[lat, lon]} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lon]}>
                    <Popup className="font-sans">
                        <span className="font-bold">{displayName}</span>
                    </Popup>
                </Marker>
            </MapContainer>
            
            {/* Decorative Swiss Overlay */}
            <div className="absolute top-4 right-4 bg-white p-2 border-2 border-black z-[1000] font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                LAT: {lat.toFixed(4)} <br/>
                LON: {lon.toFixed(4)}
            </div>
        </div>
    );
}
