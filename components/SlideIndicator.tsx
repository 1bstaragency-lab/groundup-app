import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface SlideIndicatorProps {
  count: number;
  active: number;
}

export default function SlideIndicator({ count, active }: SlideIndicatorProps) {
  const dots = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={styles.container}>
      {dots.map((i) => {
        const isActive = i === active;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: isActive ? 8 : 6,
                height: isActive ? 8 : 6,
                borderRadius: isActive ? 4 : 3,
                backgroundColor: isActive ? Colors.accent : '#333333',
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {},
});
