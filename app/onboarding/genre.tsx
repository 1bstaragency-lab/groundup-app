import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import ChipSelect from '../../components/ChipSelect';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, FontSize } from '../../constants/theme';

const OPTIONS = [
  'Hip-Hop / Rap',
  'R&B / Soul',
  'Pop',
  'Afrobeats',
  'Latin',
  'Electronic / Dance',
  'Rock / Alternative',
  'Country',
  'Other',
];

export default function GenreScreen() {
  const genre = useOnboardingStore((s) => s.genre);
  const setGenre = useOnboardingStore((s) => s.setGenre);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What's your genre?</Text>

        <ChipSelect
          options={OPTIONS}
          selected={genre}
          onSelect={setGenre}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={() => router.push('/onboarding/stage')}
          disabled={genre.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
});
