import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, Text } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', isLoading = false, style, ...otherProps }: ButtonProps) {
  // Brand colors: Primary is always black with white text for premium feel
  const primaryBg = '#1A1A1A';
  const primaryText = '#FFFFFF';
  
  const secondaryBg = useThemeColor({ light: '#F6F6F6', dark: '#2C2C2C' }, 'background');
  const secondaryText = useThemeColor({ light: '#1A1A1A', dark: '#FFFFFF' }, 'text');

  const bg = variant === 'primary' ? primaryBg : secondaryBg;
  const textColor = variant === 'primary' ? primaryText : secondaryText;

  return (
    <Pressable
      style={(state) => [
        styles.button,
        { backgroundColor: bg },
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      disabled={isLoading}
      {...otherProps}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28, // Fully rounded capsule
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }], // Tactile scale feedback
  },
});
