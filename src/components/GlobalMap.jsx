"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import of Map component to avoid SSR issues
const Map = dynamic(() => import("./Map2"), { ssr: false });

export default function MapHome({
  trips = [],
  onTripSelect,
  onFootprintSelect,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  // Combine all locations from all trips
  const locations = trips.flatMap(
    (trip) =>
      trip.locations?.map((loc) => ({
        ...loc,
        tripId: trip.id,
        tripTitle: trip.title,
      })) || []
  );

  // Handle marker click to show location/footprint details
  const handleMarkerClick = (location) => {
    if (onFootprintSelect) {
      onFootprintSelect({
        id: location.id,
        trip_id: location.tripId,
        name: location.name,
        description: location.description,
        location: location.location,
        date: location.date,
        photo: location.photo,
        lat: location.lat,
        lng: location.lng,
      });
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}
      >
        <div className="animate-spin text-yellow-500">↻</div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div
        className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}
      >
        <p className="text-sm text-gray-500">No footprints to display</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Map
        locations={locations}
        onMarkerClick={handleMarkerClick}
        showPopup={true}
        className="rounded-none shadow-none"
        zoom={2}
      />
    </div>
  );
}
