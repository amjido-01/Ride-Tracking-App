export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Vehicle {
  make: string;
  model: string;
  color: string;
  plateNumber: string;
  image?: string; // Reference to vehicle visual asset/avatar
}

export interface Driver {
  id: string;
  name: string;
  rating: number; // e.g. 4.98
  avatar: string; // Driver profile image source (URI or local asset)
  phone: string;
}

export interface RoutePoint extends Coordinate {
  bearing?: number; // Bearing in degrees (0-360) for smooth marker heading rotation
}

export type RideStatus = 'IDLE' | 'ACTIVE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export interface Ride {
  id: string;
  status: RideStatus;
  driver: Driver;
  vehicle: Vehicle;
  driverLocation: Coordinate;
  destinationLocation: Coordinate;
  routePath: RoutePoint[];
  currentStepIndex: number;
  distanceRemainingMeters: number;
  etaMinutes: number;
}

export interface TripSummary {
  rideId: string;
  distanceMeters: number;
  durationSeconds: number;
  fareAmount: number;
  completedAt: string; // ISO timestamp
}
