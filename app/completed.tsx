import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RideStats } from '../components/ride/ride-stats';
import { ThemedText } from '../components/themed-text';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/ui/empty-state';
import { useRide } from '../context/ride-context';

export default function RideCompletedScreen() {
  const router = useRouter();
  const { ride, tripSummary, resetRide } = useRide();

  // Hardcoded for premium white theme as requested
  const backgroundColor = '#FFFFFF';

  // Trigger state reset and return to tracking index
  const handleCompleteRide = () => {
    resetRide();
    router.replace('/');
  };

  // Gracefully handle the edge case where no ride details exist (Direct URL entry / Reloads)
  if (!tripSummary) {
    return (
      <EmptyState
        title="No Receipt Available"
        message="There is no completed ride session found in this session. Please start a tracking simulation."
        icon="receipt-outline"
        onAction={() => router.replace('/')}
        actionText="Return to Map"
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Visual Success Hero Block */}
        <View style={styles.successBlock}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark-sharp" size={36} color="#059669" />
          </View>
          <ThemedText style={styles.successTitle} type="subtitle">
            Arrived at Destination
          </ThemedText>
          <ThemedText style={styles.successSubtitle}>
            Thank you for riding with us
          </ThemedText>
        </View>

        {/* Central Invoice Receipt Component */}
        <View style={styles.receiptWrapper}>
          <RideStats
            summary={tripSummary}
            driver={ride.driver}
            vehicle={ride.vehicle}
          />
        </View>
      </View>

      {/* Primary Action Complete Button */}
      <View style={styles.footer}>
        <Button
          title="Complete Ride"
          variant="primary"
          onPress={handleCompleteRide}
          style={styles.completeBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Success Hero styling
  successBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5', // Translucent emerald
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1A1A1A',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  // Invoice layout spacing
  receiptWrapper: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
  },
  // Footer Complete button layout
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  completeBtn: {
    width: '100%',
  },
});
