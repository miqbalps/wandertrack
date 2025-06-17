"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function RouteMap({ footprints = [], className = "" }) {
  const [map, setMap] = useState(null);

  // Custom icon for footprints
  const footprintIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EAB308'%3E%3Ccircle cx='12' cy='12' r='10' stroke='white' stroke-width='2'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='11' fill='black' font-family='Arial' font-weight='bold'%3E%pin%3C/text%3E%3C/svg%3E",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Create numbered icons for each footprint
  const getNumberedIcon = (number) => {
    return L.divIcon({
      className: "custom-numbered-icon",
      html: `
        <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-bold border-2 border-white">
          ${number}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Calculate bounds to fit all markers
  useEffect(() => {
    if (map && footprints.length > 0) {
      const bounds = L.latLngBounds(
        footprints.map((f) => [f.latitude, f.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, footprints]);

  // Create route coordinates
  const routeCoordinates = footprints.map((f) => [f.latitude, f.longitude]);

  if (footprints.length === 0) {
    return (
      <div
        className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}
      >
        <p className="text-sm text-gray-500">No footprints to display</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[footprints[0].latitude, footprints[0].longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className={`${className} z-0 rounded-xl`}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route line connecting footprints */}
      {/* color: "#EAB308" */}
      <Polyline
        positions={routeCoordinates}
        pathOptions={{
          color: "red",
          weight: 3,
          opacity: 0.8,
          dashArray: "10, 10",
        }}
      />

      {/* Footprint markers */}
      {footprints.map((footprint, index) => (
        <Marker
          key={footprint.id}
          position={[footprint.latitude, footprint.longitude]}
          icon={getNumberedIcon(index + 1)}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-sm">{footprint.title}</h3>
              <p className="text-xs text-gray-600">
                {new Date(footprint.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {footprint.cover_photo_url && (
                <img
                  src={footprint.cover_photo_url}
                  alt={footprint.title}
                  className="mt-2 w-full h-24 object-cover rounded"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
