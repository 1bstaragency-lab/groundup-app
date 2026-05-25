import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, FontSize } from '../constants/theme';

interface ContinueButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export default function ContinueButton({
  onPress,
  disabled = false,
  label = 'Continue \u2192',
}: ContinueButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        { marginBottom: Math.max(insets.bottom, 16) },
      ]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#333333',
  },
  label: {
    color: '#000000',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  labelDisabled: {
    color: '#666666',
  },
});
