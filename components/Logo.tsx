import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface LogoProps {
  size?: number;
  style?: TextStyle;
}

export default function Logo({ size = 36, style }: LogoProps) {
  return (
    <Text style={[styles.base, { fontSize: size, lineHeight: size * 1.2 }, style]}>
      <Text style={styles.white}>ground</Text>
      <Text style={styles.accent}>u</Text>
      <Text style={styles.white}>P</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '700',
  },
  white: {
    color: Colors.white,
  },
  accent: {
    color: Colors.accent,
  },
});
