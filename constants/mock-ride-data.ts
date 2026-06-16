import { Driver, Vehicle, RoutePoint, Coordinate } from '../types/ride';

export const MOCK_DRIVER: Driver = {
  id: 'drv_23091',
  name: 'Abubakar Muhammad',
  rating: 4.92,
  avatar: require('../assets/images/ala.jpg'), 
  phone: '+234 803 123 4567',
};

export const MOCK_VEHICLE: Vehicle = {
  make: 'Toyota',
  model: 'Corolla (Silver)',
  color: 'Silver Metallic',
  plateNumber: 'KAN 318 AA',
  image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=400&auto=format&fit=crop',
};

export const MOCK_START_LOCATION: Coordinate = {
  latitude: 12.0022,
  longitude: 8.5167,
};

export const MOCK_DESTINATION_LOCATION: Coordinate = {
  latitude: 11.9913,
  longitude: 8.5280,
};

/**
 * Predefined route coordinates path in Kano City.
 * The path starts near the Kano State Government House area on Audu Bako Way,
 * heads south-east through the city centre, passing along Ibrahim Taiwo Road,
 * and arrives near the Kano Central Mosque / Emir's Palace area.
 */
export const MOCK_ROUTE_PATH: RoutePoint[] = [
  // Segment 1: Heading south-east along Audu Bako Way (bearing ~135)
  { latitude: 12.0022, longitude: 8.5167, bearing: 135 },
  { latitude: 12.0010, longitude: 8.5180, bearing: 135 },
  { latitude: 11.9998, longitude: 8.5193, bearing: 135 },
  { latitude: 11.9986, longitude: 8.5206, bearing: 135 },
  { latitude: 11.9975, longitude: 8.5218, bearing: 135 },

  // Segment 2: Curving east along Ibrahim Taiwo Road (bearing ~110)
  { latitude: 11.9968, longitude: 8.5232, bearing: 110 },
  { latitude: 11.9960, longitude: 8.5245, bearing: 110 },

  // Segment 3: Heading south-east towards Emir's Palace (bearing ~150)
  { latitude: 11.9948, longitude: 8.5255, bearing: 150 },
  { latitude: 11.9935, longitude: 8.5265, bearing: 150 },
  { latitude: 11.9925, longitude: 8.5273, bearing: 150 },
  { latitude: 11.9913, longitude: 8.5280, bearing: 150 }, // Emir's Palace area
];

