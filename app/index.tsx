import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRide } from '../context/ride-context';
import { useRideSimulation } from '../hooks/use-ride-simulation';
import { MapComponent } from '../components/ride/map-view';
import { DriverCard } from '../components/ride/driver-card';
import { ThemedText } from '../components/themed-text';
import { LoadingScreen } from '../components/ui/loading-screen';
import { ErrorState } from '../components/ui/error-state';
import { useThemeColor } from '@/hooks/use-theme-color';
import { EmptyState } from '@/components/ui/empty-state';

export default function ActiveRideScreen() {
  const router = useRouter();
  const { ride, resetRide, cancelRide, isLoading, error, setError } = useRide();
  
  // Launch driver coordinate movement simulator
  useRideSimulation(ride.status === 'ACTIVE');

  const headerBg = useThemeColor({ light: 'rgba(255, 255, 255, 0.9)', dark: 'rgba(26, 26, 26, 0.9)' }, 'background');

  // Trigger navigation automatically when driver reaches destination
  useEffect(() => {
    if (ride.status === 'ARRIVED') {
      router.replace('/completed');
    }
  }, [ride.status, router]);

  const handleCancelRide = () => {
    cancelRide();
  };

  // Render loading state
  if (isLoading) {
    return <LoadingScreen message="Loading active ride details..." />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load ride"
        message={error}
        onRetry={() => {
          setError(null);
          resetRide();
        }}
      />
    );
  }

  if (ride.status === 'CANCELLED') {
    return (
      <EmptyState
        title="Ride Cancelled"
        message="The ride simulation has been cancelled. Would you like to start a new ride?"
        icon="close-circle-outline"
        onAction={() => resetRide()}
        actionText="Restart Simulation"
      />
    );
  }

  return (
    <View style={styles.container}>
      <MapComponent
        driverLocation={ride.driverLocation}
        destinationLocation={ride.destinationLocation}
        routePath={ride.routePath}
        currentStepIndex={ride.currentStepIndex}
        status={ride.status}
      />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={[styles.headerFloatingCapsule, { backgroundColor: headerBg }]}>
          <Pressable style={styles.headerBackBtn} onPress={handleCancelRide}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle} type="defaultSemiBold">
              Gwale
            </ThemedText>
            <Ionicons name="arrow-forward" size={14} color="white" style={styles.headerArrow} />
            <ThemedText style={styles.headerTitle} type="defaultSemiBold">
              Dala
            </ThemedText>
          </View>
          <Pressable style={styles.headerMinimizeBtn}>
            <Ionicons name="remove" size={24} color="#1A1A1A" />
          </Pressable>
        </View>
      </SafeAreaView>

      <DriverCard
        driver={ride.driver}
        vehicle={ride.vehicle}
        etaMinutes={ride.etaMinutes}
        distanceRemainingMeters={ride.distanceRemainingMeters}
        onCancelPress={handleCancelRide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Floating Top Header Bar Styles
  safeHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerFloatingCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerBackBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerArrow: {
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  headerMinimizeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
