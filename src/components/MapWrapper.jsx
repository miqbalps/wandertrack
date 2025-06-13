// MapWrapper.js
"use client";

import dynamic from "next/dynamic";

// Import seluruh komponen Map dengan ssr disabled
const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <p>Loading map...</p>
    </div>
  ),
});

const MapWrapper = (props) => {
  return <DynamicMap {...props} />;
};

export default MapWrapper;
