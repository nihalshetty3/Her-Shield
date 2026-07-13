import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

export default function GuardianMap() {

    const [location, setLocation] = useState(null);

    async function load() {

        const res = await fetch("http://localhost:8000/dashboard");
        const data = await res.json();

        setLocation(data.location);

    }

    useEffect(() => {

        load();

        const timer = setInterval(load, 2000);

        return () => clearInterval(timer);

    }, []);

    // Safe fallback values
    const lat = location?.latitude ?? 12.9143;
    const lng = location?.longitude ?? 74.8560;

    const center = [lat, lng];

    return (

        <div className="bg-zinc-900 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-white mb-4">
                📍 Live Guardian Map
            </h2>

            <MapContainer
                center={center}
                zoom={18}
                style={{
                    height: "500px",
                    width: "100%",
                    borderRadius: "20px"
                }}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={center}>

                    <Popup>
                        Victim Current Location
                    </Popup>

                </Marker>

            </MapContainer>

        </div>

    );

}