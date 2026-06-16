import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed-text';
import { Button } from './button';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
}: ErrorStateProps) {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={32} color="#EF4444" />
      </View>
      <ThemedText style={styles.titleText} type="subtitle">
        {title}
      </ThemedText>
      <ThemedText style={styles.messageText}>
        {message}
      </ThemedText>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          style={styles.retryButton}
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
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  retryButton: {
    width: '100%',
    maxWidth: 200,
  },
});
