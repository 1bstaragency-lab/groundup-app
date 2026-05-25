import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface ChipSelectProps {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}

export default function ChipSelect({ options, selected, onSelect }: ChipSelectProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            onPress={() => onSelect(option)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  chipText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.accent,
  },
});
