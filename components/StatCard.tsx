import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';

interface StatCardProps {
  label: string;
  value: number;
  delta: number;
  prefix?: string;
  suffix?: string;
}

const BAR_HEIGHTS = [0.4, 0.7, 0.5, 0.9, 0.65];

export default function StatCard({
  label,
  value,
  delta,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1000;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  const isPositive = delta >= 0;
  const deltaColor = isPositive ? Colors.positive : Colors.negative;
  const deltaArrow = isPositive ? '\u2191' : '\u2193';
  const deltaLabel = `${deltaArrow}${Math.abs(delta)}%`;

  const formattedValue = `${prefix}${displayValue.toLocaleString()}${suffix}`;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{formattedValue}</Text>
        <View style={[styles.deltaBadge, { backgroundColor: deltaColor + '20' }]}>
          <Text style={[styles.deltaText, { color: deltaColor }]}>
            {deltaLabel}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {BAR_HEIGHTS.map((h, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: h * 32,
                backgroundColor: Colors.accent,
                opacity: 0.4 + h * 0.6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  label: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  value: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  deltaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deltaText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 32,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
});
