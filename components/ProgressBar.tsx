import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const segments = Array.from({ length: total }, (_, i) => i);

  return (
    <View style={styles.container}>
      {segments.map((i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < current ? Colors.accent : Colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
});
