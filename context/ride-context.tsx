import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Ride, RideStatus, TripSummary, Coordinate, RoutePoint } from '../types/ride';
import {
  MOCK_DRIVER,
  MOCK_VEHICLE,
  MOCK_START_LOCATION,
  MOCK_DESTINATION_LOCATION,
  MOCK_ROUTE_PATH,
} from '../constants/mock-ride-data';
import { calculateDistance, calculateFare, calculateRouteDistance } from '../utils/ride-helpers';

interface RideContextType {
  ride: Ride;
  tripSummary: TripSummary | null;
  updateDriverLocation: (coord: Coordinate, stepIndex: number) => void;
  triggerArrival: () => void;
  resetRide: () => void;
  cancelRide: () => void;
  isLoading: boolean;
  error: string | null;
  setIsLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

// 3 seconds per step. In our simulation, we scale this:
// 1 step (3 seconds of app time) = 1 minute (60 seconds) of simulated ride time.
// This makes duration stats look realistic on the receipt.
const TIME_SCALE_MULTIPLIER = 60; 

const initialRideState: Ride = {
  id: 'ride_lg_90812',
  status: 'ACTIVE',
  driver: MOCK_DRIVER,
  vehicle: MOCK_VEHICLE,
  driverLocation: MOCK_START_LOCATION,
  destinationLocation: MOCK_DESTINATION_LOCATION,
  routePath: MOCK_ROUTE_PATH,
  currentStepIndex: 0,
  distanceRemainingMeters: 0, // Will be computed on launch
  etaMinutes: 0,
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ride, setRide] = useState<Ride>(() => {
    const initialDistance = calculateRouteDistance(MOCK_ROUTE_PATH);
    const stepsCount = MOCK_ROUTE_PATH.length;
    return {
      ...initialRideState,
      distanceRemainingMeters: initialDistance,
      etaMinutes: Math.ceil((stepsCount * TIME_SCALE_MULTIPLIER) / 60),
    };
  });

  const [tripSummary, setTripSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  // Stable ref used to pass computed TripSummary out of a setRide functional
  // updater without nesting setState calls (concurrent-mode safe pattern).
  const pendingSummaryRef = useRef<TripSummary | null>(null);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
  }, []);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  /**
   * Called on every timer tick to shift driver coordinates.
   * Recalculates the remaining distance and ETA dynamically.
   */
  const updateDriverLocation = useCallback((coord: Coordinate, stepIndex: number) => {
    setRide((prev) => {
      // Calculate remaining path length starting from the active step index
      let remainingDistance = 0;
      for (let i = stepIndex; i < prev.routePath.length - 1; i++) {
        remainingDistance += calculateDistance(prev.routePath[i], prev.routePath[i + 1]);
      }

      // Add segment distance between current physical location and next node (if intermediate)
      if (stepIndex < prev.routePath.length - 1) {
        remainingDistance += calculateDistance(coord, prev.routePath[stepIndex + 1]);
      }

      // Remaining steps to travel
      const remainingSteps = prev.routePath.length - 1 - stepIndex;
      // Convert remaining steps to minutes (1 step = 1 minute)
      const etaMinutes = Math.max(1, Math.ceil(remainingSteps));

      return {
        ...prev,
        driverLocation: coord,
        currentStepIndex: stepIndex,
        distanceRemainingMeters: Math.round(remainingDistance),
        etaMinutes,
      };
    });
  }, []);

  /**
   * Triggered when the simulation timer finishes.
   * Compiles the final receipt metrics and changes status to 'ARRIVED'.
   *
   * FIX: setTripSummary is intentionally called AFTER setRide (not inside its
   * functional updater) to avoid the React anti-pattern of nested setState
   * calls, which is unsafe under concurrent mode.
   */
  const triggerArrival = useCallback(() => {
    // Snapshot the current route before updating state
    setRide((prev) => {
      // Compute summary metrics from the snapshot inside the updater
      // then store them on a stable ref so we can setTripSummary afterwards
      let totalDistance = 0;
      for (let i = 0; i < prev.routePath.length - 1; i++) {
        totalDistance += calculateDistance(prev.routePath[i], prev.routePath[i + 1]);
      }
      const totalSteps = prev.routePath.length - 1;
      const durationSeconds = totalSteps * TIME_SCALE_MULTIPLIER;
      const finalFare = calculateFare(totalDistance, durationSeconds);

      // Store computed values on a ref so they are accessible after this updater returns
      pendingSummaryRef.current = {
        rideId: prev.id,
        distanceMeters: Math.round(totalDistance),
        durationSeconds,
        fareAmount: finalFare,
        completedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        status: 'ARRIVED' as RideStatus,
        driverLocation: prev.destinationLocation,
        currentStepIndex: prev.routePath.length - 1,
        distanceRemainingMeters: 0,
        etaMinutes: 0,
      };
    });

    // Safe: called after setRide, not nested inside its updater
    if (pendingSummaryRef.current) {
      setTripSummary(pendingSummaryRef.current);
      pendingSummaryRef.current = null;
    }
  }, []);

  /**
   * Resets the entire ride back to step 0 and clears the summary state.
   */
  const resetRide = useCallback(() => {
    const initialDistance = calculateRouteDistance(MOCK_ROUTE_PATH);
    const stepsCount = MOCK_ROUTE_PATH.length;

    setRide({
      ...initialRideState,
      distanceRemainingMeters: initialDistance,
      etaMinutes: Math.ceil((stepsCount * TIME_SCALE_MULTIPLIER) / 60),
    });
    setTripSummary(null);
    setErrorState(null);
    setIsLoadingState(false);
  }, []);

  /**
   * Cancels the active ride, stopping the simulation.
   */
  const cancelRide = useCallback(() => {
    setRide((prev) => ({
      ...prev,
      status: 'CANCELLED' as RideStatus,
    }));
  }, []);

  return (
    <RideContext.Provider
      value={{
        ride,
        tripSummary,
        updateDriverLocation,
        triggerArrival,
        resetRide,
        cancelRide,
        isLoading,
        error,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
