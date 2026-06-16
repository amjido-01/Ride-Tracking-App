import { Coordinate } from '../types/ride';

/**
 * Calculates the geodesic distance between two coordinates in meters
 * using the Haversine formula.
 */
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coord1.latitude * Math.PI) / 180;
  const lat2 = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLng = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Calculates the total distance of a route path in meters.
 */
export const calculateRouteDistance = (path: Coordinate[]): number => {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += calculateDistance(path[i], path[i + 1]);
  }
  return totalDistance;
};

/**
 * Formats a distance value (in meters) to a user-friendly string (km).
 */
export const formatDistance = (meters: number): string => {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Formats duration in seconds to minutes and seconds (e.g. 5m 23s) or simple minutes.
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  if (mins === 0) {
    return `${seconds} secs`;
  }
  return `${mins} min`;
};

/**
 * Calculates fare amount in Nigerian Naira (NGN) based on Lagos-like pricing:
 * - Base Fare: ₦500
 * - Per Meter Rate: ₦0.25 (₦250 per km)
 * - Per Second Rate: ₦0.50 (₦30 per minute)
 */
export const calculateFare = (distanceMeters: number, durationSeconds: number): number => {
  const baseFare = 500;
  const distanceCost = distanceMeters * 0.25;
  const durationCost = durationSeconds * 0.50;
  
  // Round to nearest 50 Naira for realistic cash formatting
  const rawFare = baseFare + distanceCost + durationCost;
  return Math.round(rawFare / 50) * 50;
};

/**
 * Formats a number to Nigerian Naira (NGN) currency layout.
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
