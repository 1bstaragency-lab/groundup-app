import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';

interface SelectableCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  mode: 'checkbox' | 'radio';
  subtitle?: string;
}

export default function SelectableCard({
  label,
  selected,
  onPress,
  mode,
  subtitle,
}: SelectableCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.cardSelected,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            mode === 'checkbox' ? styles.checkbox : styles.radio,
            selected && (mode === 'checkbox' ? styles.checkboxSelected : styles.radioSelected),
          ]}
        >
          {selected && mode === 'checkbox' && (
            <Text style={styles.checkmark}>{'\u2713'}</Text>
          )}
          {selected && mode === 'radio' && <View style={styles.radioInner} />}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {subtitle != null && subtitle.length > 0 && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  checkboxSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  checkmark: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  radioSelected: {
    borderColor: Colors.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  subtitle: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    marginTop: 4,
  },
});
