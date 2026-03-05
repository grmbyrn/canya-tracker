import { COLORS } from "../constants/colors";

export type PriceCategory = "cheap" | "mid" | "expensive";

export function getPriceCategory(price: number): PriceCategory {
  if (price < 1.8) return "cheap";
  if (price >= 2.5) return "expensive";
  return "mid";
}

export function getPriceColor(price: number): string {
  const category = getPriceCategory(price);
  switch (category) {
    case "cheap":
      return COLORS.green;
    case "mid":
      return COLORS.amber;
    case "expensive":
      return COLORS.red;
  }
}

export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}

// Haversine formula, returns human-friendly distance string
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // metres
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = Math.round(R * c);
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default {
  getPriceCategory,
  getPriceColor,
  formatPrice,
  getDistance,
};
