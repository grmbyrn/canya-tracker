export const BARCELONA_REGION = {
  latitude: 41.3917,
  longitude: 2.1649,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

// A compact dark Google Maps style (common permissively-licensed style)
export const DARK_MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
];

export const MAP_FILTERS = [
  { key: "openNow", label: "Open now" },
  { key: "price_cheap", label: "Cheap" },
  { key: "price_mid", label: "Mid range" },
  { key: "price_expensive", label: "Expensive" },
];

export const LIST_SORTS = [
  { key: "closest", label: "Closest" },
  { key: "cheapest", label: "Cheapest" },
  { key: "highest_price", label: "Highest price" },
  { key: "name", label: "Name" },
];
