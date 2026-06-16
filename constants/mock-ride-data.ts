import { Driver, Vehicle, RoutePoint, Coordinate } from '../types/ride';

export const MOCK_DRIVER: Driver = {
  id: 'drv_23091',
  name: 'Oluwaseun Adebayo',
  rating: 4.92,
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop', // Professional portrait
  phone: '+234 803 123 4567', // Standard Nigerian phone number format
};

export const MOCK_VEHICLE: Vehicle = {
  make: 'Toyota',
  model: 'Corolla (Silver)',
  color: 'Silver Metallic',
  plateNumber: 'LND 452 GZ', // Realistic Lagos license plate format
  image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=400&auto=format&fit=crop', // Standard silver sedan
};

export const MOCK_START_LOCATION: Coordinate = {
  latitude: 6.4280, // Eko Hotels & Suites, Victoria Island, Lagos
  longitude: 3.4219,
};

export const MOCK_DESTINATION_LOCATION: Coordinate = {
  latitude: 6.4357, // Civic Centre, Ozumba Mbadiwe Ave, Victoria Island, Lagos
  longitude: 3.4093,
};

/**
 * Predefined route coordinates path in Victoria Island, Lagos.
 * The path leaves Eko Hotels & Suites on Adetokunbo Ademola St (heading North-West),
 * enters the roundabout, and drives down Ozumba Mbadiwe Ave (heading West-South-West)
 * to Civic Centre.
 */
export const MOCK_ROUTE_PATH: RoutePoint[] = [
  // Segment 1: Heading North-West along Adetokunbo Ademola St (bearing ~325 degrees)
  { latitude: 6.4280, longitude: 3.4219, bearing: 325 },
  { latitude: 6.4294, longitude: 3.4208, bearing: 325 },
  { latitude: 6.4301, longitude: 3.4202, bearing: 325 },
  { latitude: 6.4308, longitude: 3.4197, bearing: 325 },
  { latitude: 6.4322, longitude: 3.4186, bearing: 325 },
  { latitude: 6.4336, longitude: 3.4175, bearing: 325 },
  
  // Segment 2: Approaching the roundabout area (bearing ~290 degrees)
  { latitude: 6.4344, longitude: 3.4168, bearing: 290 },
  
  // Segment 3: Heading West-South-West along Ozumba Mbadiwe Ave (bearing ~250 degrees)
  { latitude: 6.4342, longitude: 3.4145, bearing: 250 },
  { latitude: 6.4346, longitude: 3.4125, bearing: 250 },
  { latitude: 6.4350, longitude: 3.4105, bearing: 250 },
  { latitude: 6.4357, longitude: 3.4093, bearing: 250 }, // Civic Centre Arrival
];
