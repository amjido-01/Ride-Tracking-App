import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...otherProps }: CardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#E5E5E5', dark: '#2C2C2C' }, 'background');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderColor },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    // Soft premium shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4, // Android elevation
  },
});
