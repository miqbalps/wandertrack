// MapComponent.js
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

const Map = ({ locations = [], onMarkerClick, className = "" }) => {
  const [icons, setIcons] = useState(null);

  useEffect(() => {
    setIcons(setupLeafletIcons());
  }, []);

  const calculateCenter = () => {
    if (!locations?.length) return [20, 0];

    const avgLat =
      locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    return [avgLat, avgLng];
  };

  return (
    <MapContainer
      center={calculateCenter()}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      className={`z-0 ${className}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {locations?.map((location, idx) => (
        <Marker
          key={`location-${idx}`}
          position={[location.lat, location.lng]}
          eventHandlers={{ click: () => onMarkerClick?.(location) }}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
