// MapWrapper.js
"use client";

import dynamic from "next/dynamic";

// Import seluruh komponen Map dengan ssr disabled
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div
      className="relative overflow-hidden rounded-2xl shadow-xl"
      style={{ height: "400px" }}
    >
      <div className="flex items-center justify-center bg-gray-100 h-full">
        <p>Loading map...</p>
      </div>
    </div>
  ),
});

const MapWrapper = (props) => {
  return <DynamicMap {...props} />;
};

export default MapWrapper;
