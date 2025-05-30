// MapComponent.js
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Image from "next/image";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

// Setup custom map icons
const setupLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl:
      "https://raw.githubusercontent.com/Leaflet/Leaflet/a01d0a91689554091498368ae184ba4cde5d395a/src/images/marker-icon.svg",
    iconRetinaUrl:
      "https://raw.githubusercontent.com/Leaflet/Leaflet/refs/heads/main/src/images/marker-icon-2x.png",
    shadowUrl:
      "https://raw.githubusercontent.com/Leaflet/Leaflet/a01d0a91689554091498368ae184ba4cde5d395a/src/images/marker-shadow.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const wastePointIcon = new L.Icon({
    iconUrl: "/images/waste-marker.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const userLocationIcon = new L.Icon({
    iconUrl: "/images/user-marker.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return {
    wastePointIcon,
    userLocationIcon,
  };
};

const Map = ({ trips = [], onTripSelect, className = "" }) => {
  const [icons, setIcons] = useState(null);

  useEffect(() => {
    setIcons(setupLeafletIcons());
  }, []);

  const calculateCenter = () => {
    if (!trips?.length) return [20, 0];
    const locations = trips.flatMap((trip) => trip.locations || []);
    if (!locations.length) return [20, 0];

    const avgLat =
      locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    return [avgLat, avgLng];
  };

  return (
    <div
      className={`relative ${className} overflow-hidden rounded-2xl shadow-xl group`}
    >
      <MapContainer
        center={calculateCenter()}
        zoom={2}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {trips?.map((trip) =>
          (trip.locations || []).map((location, idx) => (
            <Marker
              key={`${trip.id}-${idx}`}
              position={[location.lat, location.lng]}
              eventHandlers={{ click: () => onTripSelect(trip) }}
            >
              <Popup>
                <div className="max-w-xs">
                  <h3 className="font-bold">{trip.title}</h3>
                  <p className="text-sm">{location.name}</p>
                  <p className="text-xs text-gray-500">{location.date}</p>
                  {location.photo && (
                    <Image
                      src={location.photo}
                      alt={location.name}
                      className="w-full h-20 object-cover mt-2 rounded"
                      width={400}
                      height={200}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
