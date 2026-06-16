import { useEffect, useRef } from 'react';
import { useRide } from '../context/ride-context';

export const useRideSimulation = (isEnabled: boolean = true) => {
  const { ride, updateDriverLocation, triggerArrival } = useRide();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Store state variables in refs to prevent continuous timer resets
  const currentStepIndexRef = useRef(ride.currentStepIndex);
  const statusRef = useRef(ride.status);
  const routePathRef = useRef(ride.routePath);

  // Keep refs synchronized on state changes
  useEffect(() => {
    currentStepIndexRef.current = ride.currentStepIndex;
    statusRef.current = ride.status;
    routePathRef.current = ride.routePath;
  }, [ride.currentStepIndex, ride.status, ride.routePath]);

  useEffect(() => {
    // Start interval only if simulation is enabled and ride is ACTIVE
    if (isEnabled && ride.status === 'ACTIVE') {
      
      intervalRef.current = setInterval(() => {
        const nextStepIndex = currentStepIndexRef.current + 1;
        const routePath = routePathRef.current;

        if (nextStepIndex < routePath.length) {
          const nextPoint = routePath[nextStepIndex];
          updateDriverLocation(
            { latitude: nextPoint.latitude, longitude: nextPoint.longitude },
            nextStepIndex
          );
        } else {
          // Final coordinate reached: Stop timer and trigger completion
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          triggerArrival();
        }
      }, 3000); // Dynamic update interval
    }

    // Cleanup timer on unmount or condition transition
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isEnabled, ride.status, updateDriverLocation, triggerArrival]);

  return {
    currentStepIndex: ride.currentStepIndex,
    isCompleted: ride.status === 'ARRIVED',
  };
};
