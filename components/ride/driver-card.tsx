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
      <View style={styles.grabHandle} />

      <View style={styles.headerRow}>
        <ThemedText style={styles.statusTitle} type="defaultSemiBold">
          Driver is arriving
        </ThemedText>
        <ThemedText style={styles.statsSubtitle}>
          {formatDistance(distanceRemainingMeters)} | {etaMinutes < 10 ? '0' : ''}{etaMinutes}:00
        </ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      <View style={styles.profileRow}>
        <Image
          source={typeof driver.avatar === 'string' ? { uri: driver.avatar } : driver.avatar}
          style={styles.avatar}
          defaultSource={require('@/assets/images/react-logo.png')}
        />
        
        <View style={styles.driverInfo}>
          <ThemedText style={styles.driverName} type="defaultSemiBold">
            {driver.name}
          </ThemedText>
          <View style={styles.roleBadge}>
            <ThemedText style={styles.roleText}>
              Driver
            </ThemedText>
          </View>
        </View>

        <View style={styles.vehicleDetails}>
          <ThemedText style={styles.vehicleModel} type="defaultSemiBold">
            {vehicle.model}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      <View style={styles.actionsRow}>
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
    paddingTop: 8,
  },
  grabHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  vehicleDetails: {
    alignItems: 'flex-end',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
