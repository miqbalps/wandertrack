import L from "leaflet";

const createMapIcon = (color = "#EAB308") =>
  L.divIcon({
    html: `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
        <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `,
    className: "custom-map-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export const defaultIcon = createMapIcon();
