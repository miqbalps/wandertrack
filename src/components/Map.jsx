// Map.js
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

  const footprintIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/Leaflet/Leaflet/a01d0a91689554091498368ae184ba4cde5d395a/src/images/marker-icon.svg",
    shadowUrl:
      "https://raw.githubusercontent.com/Leaflet/Leaflet/a01d0a91689554091498368ae184ba4cde5d395a/src/images/marker-shadow.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return {
    footprintIcon,
  };
};

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
};

const Map = ({
  locations = [],
  onMarkerClick,
  onMapClick,
  className = "",
  center = null,
  zoom = 2,
  clickable = false,
}) => {
  const [icons, setIcons] = useState(null);

  useEffect(() => {
    setIcons(setupLeafletIcons());
  }, []);

  const calculateCenter = () => {
    if (center) return center;
    if (!locations?.length) return [-6.9175, 107.6191]; // Default to Bandung

    const avgLat =
      locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    return [avgLat, avgLng];
  };

  const getZoomLevel = () => {
    if (locations?.length === 1) return 15;
    if (locations?.length > 1) return 10;
    return zoom;
  };

  return (
    <MapContainer
      center={calculateCenter()}
      zoom={getZoomLevel()}
      style={{ height: "100%", width: "100%" }}
      className={`z-0 ${className}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {clickable && <MapClickHandler onMapClick={onMapClick} />}

      {locations?.map((location, idx) => (
        <Marker
          key={`location-${idx}`}
          position={[location.lat, location.lng]}
          icon={icons?.footprintIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(location),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
