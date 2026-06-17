import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { AnimatedRegion, Marker, Polyline } from 'react-native-maps';
import { Coordinate, RideStatus, RoutePoint } from '../../types/ride';

interface MapComponentProps {
  driverLocation: Coordinate;
  destinationLocation: Coordinate;
  routePath: RoutePoint[];
  currentStepIndex: number;
  status: RideStatus;
}

export function MapComponent({
  driverLocation,
  destinationLocation,
  routePath,
  currentStepIndex,
  status,
}: MapComponentProps) {
  const mapRef = useRef<MapView>(null);
  
  // Theme colors for map overlays
  const routeColor = useThemeColor({ light: '#1A1A1A', dark: '#FFFFFF' }, 'text');
  const routeBgColor = useThemeColor({ light: '#E5E5E5', dark: '#2C2C2C' }, 'background');

  /**
   * Normalises a bearing transition so the animation always takes
   * the shorter arc (≤180°), preventing the 0°/360° wrap-around spin.
   */
  const normalizeBearing = (from: number, to: number): number => {
    let delta = to - from;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return from + delta;
  };

  // Initialize the animated region at start location
  const animatedCoordinateRef = useRef(
    new AnimatedRegion({
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    })
  );

  // Initialize the animated bearing for smooth turns
  const animatedBearingRef = useRef(
    new Animated.Value(routePath[currentStepIndex]?.bearing ?? 0)
  );

  // Track the last bearing value ourselves so we can normalize direction
  // without relying on Animated.Value's private __getValue() API.
  const prevBearingRef = useRef(routePath[currentStepIndex]?.bearing ?? 0);

  // Memoize interpolation object — creating it on every render is wasteful
  // and can cause subtle visual inconsistencies with ongoing animations.
  const rotateInterpolate = useRef(
    animatedBearingRef.current.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    })
  ).current;

  // Control custom marker tracking flags to avoid redraw performance lags
  const [tracksCarView, setTracksCarView] = useState(true);

  // Trigger smooth transition whenever driver coordinate changes
  useEffect(() => {
    const { latitude, longitude } = driverLocation;

    // Enable tracking during transition start
    setTracksCarView(true);

    animatedCoordinateRef.current.timing({
      latitude,
      longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
      toValue: {
        latitude,
        longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      },
      duration: 3000,
      useNativeDriver: false,
    } as any).start(() => {
      // Disable tracking once frame transitions complete to reduce draw loops
      setTracksCarView(false);
    });
  }, [driverLocation]);

  // Smoothly animate the car's heading rotation (bearing turns)
  useEffect(() => {
    const nextBearing = routePath[currentStepIndex]?.bearing ?? 0;
    // Normalize to always rotate via the shortest arc (≤ 180°)
    const targetBearing = normalizeBearing(prevBearingRef.current, nextBearing);

    // Update our manual tracker so the next tick has the correct "from" value
    prevBearingRef.current = targetBearing;

    Animated.timing(animatedBearingRef.current, {
      toValue: targetBearing,
      duration: 800,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [currentStepIndex, routePath]);


  // Adjust camera viewport to enclose driver, path, and destination
  useEffect(() => {
    if (mapRef.current && routePath.length > 0) {
      const coordinatesToFit = [
        driverLocation,
        destinationLocation,
        ...routePath,
      ];

      mapRef.current.fitToCoordinates(coordinatesToFit, {
        edgePadding: {
          top: 100,
          right: 60,
          bottom: 300, // Large padding to avoid floating driver details card
          left: 60,
        },
        animated: true,
      });
    }
  }, [destinationLocation, routePath]); // Trigger only on load/path resets

  // Fit camera around driver on movement update
  useEffect(() => {
    if (mapRef.current && status === 'ACTIVE') {
      mapRef.current.animateCamera(
        {
          center: driverLocation,
          zoom: 16,
        },
        { duration: 1000 }
      );
    }
  }, [driverLocation, status]);


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* Route Path Polyline */}
        {routePath.length > 0 && (
          <>
            {/* Outer wider line representing the path backdrop */}
            <Polyline
              coordinates={routePath}
              strokeColor={routeBgColor}
              strokeWidth={6}
              lineCap="round"
              lineJoin="round"
            />
            {/* Inner line representing route track */}
            <Polyline
              coordinates={routePath}
              strokeColor={routeColor}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}

        {/* Pickup Pin Marker */}
        {routePath.length > 0 && (
          <Marker
            coordinate={{ latitude: routePath[0].latitude, longitude: routePath[0].longitude }}
            tracksViewChanges={true}
            accessibilityLabel="Pickup marker"
            accessibilityRole="image"
            zIndex={2}
          >
            <View style={styles.customMarkerContainer}>
              <View style={styles.simpleLabelBubble}>
                <Text style={styles.simpleLabelText}>Pickup</Text>
              </View>
              <View style={styles.pickupMarkerOuter}>
                <View style={styles.pickupMarkerInner} />
              </View>
            </View>
          </Marker>
        )}

        {/* Destination Pin Marker */}
        <Marker
          coordinate={destinationLocation}
          tracksViewChanges={true}
          accessibilityLabel="Destination marker"
          accessibilityRole="image"
          zIndex={1}
        >
          <View style={styles.customMarkerContainer}>
            <View style={styles.simpleLabelBubble}>
              <Text style={styles.simpleLabelText}>Destination</Text>
            </View>
            <View style={styles.destMarkerOuter}>
              <View style={styles.destMarkerInner} />
            </View>
          </View>
        </Marker>

        {/* Animated Driver Car Marker */}
        <Marker.Animated
          coordinate={animatedCoordinateRef.current as any} // AnimatedRegion typing workaround
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={tracksCarView}
          accessibilityLabel="Driver location marker"
          accessibilityRole="image"
        >
          <Animated.View
            style={[
              styles.carMarker,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <View style={styles.carMarkerBorder}>
              <View style={styles.carMarkerBody}>
                <Ionicons name="car-sport" size={18} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>
        </Marker.Animated>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // Custom Marker Callout Styling
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  simpleLabelBubble: {
    width: 80, // Explicit width fixes Android text measuring
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 4,
    alignItems: 'center',
  },
  simpleLabelText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  // Destination Pin Styling (Premium Minimalist Dot)
  destMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6', // Dest Blue
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Pickup Pin Styling
  pickupMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981', // Emerald Green
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickupMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  destMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  // Animated Car Marker Styling (Circular emblem with direction orientation)
  carMarker: {
    padding: 8,
  },
  carMarkerBorder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  carMarkerBody: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A', // Brand Black
    justifyContent: 'center',
    alignItems: 'center',
  },
});
