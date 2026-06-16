import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/card';
import { ThemedText } from '../themed-text';
import { TripSummary, Driver, Vehicle } from '../../types/ride';
import { formatDistance, formatDuration, formatCurrency } from '../../utils/ride-helpers';
import { useThemeColor } from '@/hooks/use-theme-color';

interface RideStatsProps {
  summary: TripSummary;
  driver: Driver;
  vehicle: Vehicle;
}

export function RideStats({ summary, driver, vehicle }: RideStatsProps) {
  // Hardcoded for premium white card style
  const dividerColor = '#F0F0F0';
  const detailsBg = '#F6F6F6';

  return (
    <Card style={[styles.cardContainer, { backgroundColor: '#FFFFFF' }]}>
      {/* Fare Display (Primary Prominent Metric) */}
      <View style={styles.fareSection}>
        <ThemedText style={styles.fareLabel}>Final Fare</ThemedText>
        <ThemedText style={styles.fareValue} type="title">
          {formatCurrency(summary.fareAmount)}
        </ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {/* Grid: Distance & Duration */}
      <View style={styles.statsGrid}>
        <View style={styles.statColumn}>
          <View style={styles.statIconBadge}>
            <Ionicons name="resize" size={16} color="#757575" />
          </View>
          <ThemedText style={styles.statLabel}>Distance</ThemedText>
          <ThemedText style={styles.statValue} type="defaultSemiBold">
            {formatDistance(summary.distanceMeters)}
          </ThemedText>
        </View>

        <View style={[styles.verticalDivider, { backgroundColor: dividerColor }]} />

        <View style={styles.statColumn}>
          <View style={styles.statIconBadge}>
            <Ionicons name="time" size={16} color="#757575" />
          </View>
          <ThemedText style={styles.statLabel}>Duration</ThemedText>
          <ThemedText style={styles.statValue} type="defaultSemiBold">
            {formatDuration(summary.durationSeconds)}
          </ThemedText>
        </View>
      </View>

      {/* Mini Driver/Vehicle Summary Badge */}
      <View style={[styles.detailsBadge, { backgroundColor: detailsBg }]}>
        <Ionicons name="checkmark-circle" size={16} color="#059669" />
        <ThemedText style={styles.detailsText}>
          Completed with {driver.name} • {vehicle.make}
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    padding: 24,
  },
  fareSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  fareValue: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 44,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  verticalDivider: {
    width: 1,
    height: 40,
  },
  detailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  detailsText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
    marginLeft: 8,
  },
});
