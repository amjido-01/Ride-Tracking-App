import { Coordinate } from '../types/ride';
import {
  calculateDistance,
  calculateRouteDistance,
  formatDistance,
  formatDuration,
  calculateFare,
  formatCurrency,
} from '../utils/ride-helpers';

describe('ride-helpers', () => {
  describe('calculateDistance', () => {
    it('calculates the correct distance between two coordinates in meters', () => {
      const coord1: Coordinate = { latitude: 6.4280, longitude: 3.4219 };
      const coord2: Coordinate = { latitude: 6.4357, longitude: 3.4093 };
      
      const distance = calculateDistance(coord1, coord2);
      
      // Expected distance is approximately 1630 meters (varies slightly by precision)
      expect(distance).toBeGreaterThan(1600);
      expect(distance).toBeLessThan(1700);
    });

    it('returns 0 when coordinates are identical', () => {
      const coord: Coordinate = { latitude: 6.4280, longitude: 3.4219 };
      expect(calculateDistance(coord, coord)).toBe(0);
    });
  });

  describe('calculateRouteDistance', () => {
    it('calculates total distance across multiple points', () => {
      const path: Coordinate[] = [
        { latitude: 6.4280, longitude: 3.4219 },
        { latitude: 6.4294, longitude: 3.4208 },
        { latitude: 6.4301, longitude: 3.4202 },
      ];
      
      const dist1 = calculateDistance(path[0], path[1]);
      const dist2 = calculateDistance(path[1], path[2]);
      
      expect(calculateRouteDistance(path)).toBeCloseTo(dist1 + dist2);
    });

    it('returns 0 for empty or single-point paths', () => {
      expect(calculateRouteDistance([])).toBe(0);
      expect(calculateRouteDistance([{ latitude: 6.4280, longitude: 3.4219 }])).toBe(0);
    });
  });

  describe('formatDistance', () => {
    it('converts meters to formatted km string', () => {
      expect(formatDistance(1500)).toBe('1.5 km');
      expect(formatDistance(2000)).toBe('2.0 km');
      expect(formatDistance(450)).toBe('0.5 km');
    });
  });

  describe('formatDuration', () => {
    it('formats seconds to minutes', () => {
      expect(formatDuration(300)).toBe('5 min');
      expect(formatDuration(65)).toBe('1 min');
    });

    it('formats sub-minute times as seconds', () => {
      expect(formatDuration(45)).toBe('45 secs');
    });
  });

  describe('calculateFare', () => {
    it('calculates fare correctly based on distance and duration', () => {
      // Base: 500
      // Distance (1000m * 0.25): 250
      // Duration (600s * 0.50): 300
      // Total: 1050
      expect(calculateFare(1000, 600)).toBe(1050);
    });

    it('rounds to the nearest 50 Naira', () => {
      // Base: 500
      // Distance (1000m * 0.25): 250
      // Duration (640s * 0.50): 320
      // Raw: 1070 -> rounds to 1050
      expect(calculateFare(1000, 640)).toBe(1050);

      // Raw: 1080 -> rounds to 1100
      expect(calculateFare(1000, 660)).toBe(1100);
    });
  });

  describe('formatCurrency', () => {
    it('formats amount to NGN currency string', () => {
      expect(formatCurrency(1050)).toMatch(/₦1,050/);
      expect(formatCurrency(15000)).toMatch(/₦15,000/);
    });
  });
});
