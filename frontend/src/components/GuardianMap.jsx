import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";

function MapSizer() {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => clearTimeout(timer);
    }, [map]);

    return null;
}

function RecenterMap({ center }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
}

export default function GuardianMap() {

    const [location, setLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [safeZones , setSafeZones] = useState([]);
    const [isMapHovered, setIsMapHovered] = useState(false);

    async function load() {

        try {

            const res = await fetch("http://localhost:8000/dashboard");

            const data = await res.json();

            setLocation(data.location);

            setRoute(data.route || []);
            safeZones(data.location?.safeZones || []);

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {

        load();

        const timer = setInterval(load, 2000);

        return () => clearInterval(timer);

    }, []);

    // fallback values
    const lat = location?.latitude ?? 12.9143;
    const lng = location?.longitude ?? 74.8560;

    const center = [lat, lng];

    const pulsingIcon = L.divIcon({

        className: "",

        html: `
        <div class="relative flex items-center justify-center w-6 h-6">

            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#be185d] opacity-60"></span>

            <span class="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[#be185d] shadow-[0_2px_8px_rgba(0,0,0,0.5)]"></span>

        </div>
        `,

        iconSize: [24, 24],
        iconAnchor: [12, 12]

    });

    const startIcon = L.divIcon({

        className: "",

        html: `
        <div class="flex items-center justify-center">

            <div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>

        </div>
        `,

        iconSize: [16, 16],
        iconAnchor: [8, 8]

    });

    return (

        <div
            onMouseEnter={() => setIsMapHovered(true)}
            onMouseLeave={() => setIsMapHovered(false)}
            className={`glass-panel glass-panel-glow relative flex flex-col p-8 rounded-3xl select-none transition-all duration-700 w-full ${
                isMapHovered
                    ? "translate-y-[-8px] scale-[1.02] border-white/20 bg-white/5 shadow-[0_20px_50px_rgba(255,240,245,0.08)]"
                    : "border-white/8 hover:translate-y-[-8px]"
            }`}
        >

            <div
                className={`absolute -top-12 left-1/4 w-1/2 h-20 bg-gradient-to-b from-pink-300/10 via-purple-500/5 to-transparent blur-xl transition-opacity duration-700 ${
                    isMapHovered ? "opacity-100" : "opacity-40"
                }`}
            />

            <div className="z-10 flex flex-col w-full">

                <h2 className="text-xl font-serif font-semibold text-white tracking-wide mb-4">

                    📍 Live Guardian Map

                </h2>

                <div className="rounded-xl overflow-hidden bg-[#04010a] border border-[#130a24]">

                    <MapContainer
                        center={center}
                        zoom={18}
                        style={{
                            height: "500px",
                            width: "100%",
                            borderRadius: "20px"
                        }}
                    >

                        <MapSizer />

                        <RecenterMap center={center} />

                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution="&copy; Esri"
                        />

                        {/* START LOCATION */}

                        {route.length > 0 && (

                            <Marker
                                position={route[0]}
                                icon={startIcon}
                            >

                                <Popup>

                                    Incident Started Here

                                </Popup>

                            </Marker>

                        )}

                        {/* CURRENT LOCATION */}

                        <Marker
                            position={center}
                            icon={pulsingIcon}
                        >

                            <Popup>

                                Victim Current Location

                            </Popup>

                        </Marker>

                        {/* SAFE ZONES */}

{safeZones.map((zone, index) => (

<Marker
    key={index}
    position={[zone.latitude, zone.longitude]}
>

    <Popup>

        <strong>{zone.name}</strong>

        <br/>

        {zone.type}

        <br/>

        {zone.distance} meters away

    </Popup>

</Marker>

))}

                        {/* ROUTE */}

                        {route.length > 1 && (

                            <Polyline
                                positions={route}
                                color="#ff1744"
                                weight={5}
                                opacity={0.9}
                            />

                        )}

                    </MapContainer>

                </div>

            </div>

            <div
                className={`absolute inset-0 rounded-3xl border border-transparent transition-all duration-700 pointer-events-none ${
                    isMapHovered
                        ? "bg-gradient-to-r from-neon-orchid/20 via-pink-300/10 to-indigo-500/20 [mask-image:linear-gradient(to_bottom,white,transparent)]"
                        : ""
                }`}
            />

        </div>

    );

}