"use client";

import MapWrapper from "@/components/MapWrapper";
import { useCallback, useState } from "react";

export default function MapPage() {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const getTrip = useCallback((tripId) => {
    if (!tripId) return null;
    for (let i = 0; i < trips.length; i++) {
      if (trips[i].id === tripId) return trips[i];
    }
    return null;
  }, []);

  return (
    <div className="w-screen h-screen">
      <MapWrapper
        onTripSelect={setSelectedTrip}
        className="aspect-[4/3] mb-5"
      />
    </div>
  );
}
