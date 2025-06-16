"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function FootprintMap({ footprint, className = "" }) {
  const position = [footprint.latitude, footprint.longitude];

  // Custom icon for footprint
  const footprintIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EAB308'%3E%3Ccircle cx='12' cy='12' r='10' stroke='white' stroke-width='2'/%3E%3C/svg%3E",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className={`${className} z-0 rounded-lg`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={footprintIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-sm">{footprint.title}</h3>
            <p className="text-xs text-gray-600">{footprint.location}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
