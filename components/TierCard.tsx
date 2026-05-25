import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';

interface TierCardProps {
  name: string;
  price: string;
  subtitle: string;
  color: string;
  features: string[];
  expanded: boolean;
  selected: boolean;
  onPress: () => void;
  recommended?: boolean;
}

export default function TierCard({
  name,
  price,
  subtitle,
  color,
  features,
  expanded,
  selected,
  onPress,
  recommended = false,
}: TierCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: selected ? color : Colors.border },
      ]}
    >
      {recommended && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={styles.radioRow}>
          <View style={[styles.radio, { borderColor: selected ? color : Colors.border }]}>
            {selected && (
              <View style={[styles.radioInner, { backgroundColor: color }]} />
            )}
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color }]}>{name}</Text>
            <Text style={styles.price}>{price}</Text>
          </View>
        </View>
      </View>

      {expanded && (
        <View style={styles.featureList}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#000000',
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  price: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '500',
    marginTop: 2,
  },
  featureList: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  bullet: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    marginRight: 8,
    lineHeight: 20,
  },
  featureText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
});
