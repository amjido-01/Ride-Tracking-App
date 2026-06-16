import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '../themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading details...' }: LoadingScreenProps) {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#121212' }, 'background');
  const spinnerColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={spinnerColor} />
      <ThemedText style={styles.messageText} type="defaultSemiBold">
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageText: {
    marginTop: 16,
    color: '#757575',
    fontSize: 15,
  },
});
