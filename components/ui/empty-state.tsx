import React, { ComponentProps } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';
import { Button } from './button';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({
  title,
  message,
  icon = 'receipt-outline',
  onAction,
  actionText,
}: EmptyStateProps) {
  // Hardcoded for premium white theme to match the completion screen
  const backgroundColor = '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color="#757575" />
      </View>
      <ThemedText style={styles.titleText} type="subtitle">
        {title}
      </ThemedText>
      <ThemedText style={styles.messageText}>
        {message}
      </ThemedText>
      {onAction && actionText && (
        <Button
          title={actionText}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  messageText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actionButton: {
    width: '100%',
    maxWidth: 200,
  },
});
