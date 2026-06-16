import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Driver, Vehicle } from '../../types/ride';
import { formatDistance } from '../../utils/ride-helpers';
import { ThemedText } from '../themed-text';
import { Card } from '../ui/card';

interface DriverCardProps {
  driver: Driver;
  vehicle: Vehicle;
  etaMinutes: number;
  distanceRemainingMeters: number;
  onCancelPress?: () => void;
}

export function DriverCard({
  driver,
  vehicle,
  etaMinutes,
  distanceRemainingMeters,
  onCancelPress,
}: DriverCardProps) {
  const cardBorderColor = useThemeColor({ light: '#E5E5E5', dark: '#2C2C2C' }, 'background');
  const dividerColor = useThemeColor({ light: '#F0F0F0', dark: '#2A2A2A' }, 'background');
  const buttonBg = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'background');
  const buttonText = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'text');
  const plateTextCol = useThemeColor({ light: '#059669', dark: '#34D399' }, 'text');

  return (
    <Card style={styles.sheetContainer}>
      {/* Top Grab Handle for sheet visual affordance */}
      <View style={styles.grabHandle} />

      {/* Row 1: ETA and Status Banners */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.statusTitle} type="defaultSemiBold">
            Driver is arriving
          </ThemedText>
          <ThemedText style={styles.statsSubtitle}>
            Distance left: {formatDistance(distanceRemainingMeters)}
          </ThemedText>
        </View>
        <View style={styles.etaBadge}>
          <ThemedText style={styles.etaText}>
            {etaMinutes}
          </ThemedText>
          <ThemedText style={styles.etaUnit}>
            MIN
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {/* Row 2: Driver profile, vehicle type and plate number */}
      <View style={styles.profileRow}>
        {/* Driver Avatar */}
        <Image
          source={{ uri: driver.avatar }}
          style={styles.avatar}
          defaultSource={require('@/assets/images/react-logo.png')} // Fallback in case of net fail
        />
        
        {/* Name and Rating */}
        <View style={styles.driverInfo}>
          <ThemedText style={styles.driverName} type="defaultSemiBold">
            {driver.name}
          </ThemedText>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#EAB308" />
            <ThemedText style={styles.ratingText}>
              {driver.rating.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        {/* Vehicle & Plate details */}
        <View style={styles.vehicleDetails}>
          <ThemedText style={styles.vehicleModel} type="defaultSemiBold">
            {vehicle.model}
          </ThemedText>
          
          {/* Custom Lagos Plate Badge */}
          <View style={[styles.plateBadge, { borderColor: cardBorderColor }]}>
            <View style={styles.plateHeader}>
              <ThemedText style={styles.plateHeaderText}>FEDERAL REPUBLIC OF NIGERIA</ThemedText>
            </View>
            <ThemedText style={[styles.plateNumberText, { color: plateTextCol }]}>
              {vehicle.plateNumber}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {/* Row 3: Action Buttons (Cancel / Call / Message) */}
      <View style={styles.actionsRow}>
        {/* Cancel Button */}
        <Pressable
          onPress={onCancelPress}
          style={({ pressed }) => [
            styles.cancelButton,
            { backgroundColor: buttonBg },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={[styles.cancelText, { color: buttonText }]} type="defaultSemiBold">
            Cancel Ride
          </ThemedText>
        </Pressable>

        {/* Action circle buttons */}
        <View style={styles.iconButtonsGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: buttonBg },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color={buttonText} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: buttonBg },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="call" size={22} color={buttonText} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 30,
    paddingTop: 12,
  },
  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  etaBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  etaText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  etaUnit: {
    color: '#E5E5E5',
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E5E5E5',
  },
  driverInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
    marginLeft: 4,
  },
  vehicleDetails: {
    alignItems: 'flex-end',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  // Lagos License Plate badge replica styling
  plateBadge: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  plateHeader: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 1,
    marginBottom: 2,
  },
  plateHeaderText: {
    fontSize: 5,
    fontWeight: 'bold',
    color: '#3B82F6', // Blue federal text
    letterSpacing: 0.3,
  },
  plateNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cancelText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  iconButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
