// Custom dark map theme matching the site's palette (ink / charcoal / ember).
// POI icons and transit are hidden to keep it clean and editorial rather than
// looking like a generic maps embed.
export const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#161616" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a86" }] },

  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a2a28" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#a8a6a0" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },

  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1d1d1b" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2119" }] },

  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2b28" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#767671" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#282826" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a2f22" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#c98a4b" }, { weight: 0.4 }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#c98a4b" }] },
  { featureType: "road.local", elementType: "labels", stylers: [{ visibility: "off" }] },

  { featureType: "transit", stylers: [{ visibility: "off" }] },

  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1512" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5c6b64" }] },
];

export default MAP_STYLE;
