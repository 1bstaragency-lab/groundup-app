import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import ContinueButton from '../../components/ContinueButton';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';

export default function NameScreen() {
  const artistName = useOnboardingStore((s) => s.artistName);
  const setArtistName = useOnboardingStore((s) => s.setArtistName);
  const inputRef = useRef<TextInput>(null);

  const canContinue = artistName.trim().length > 0;

  const handleSubmit = () => {
    if (canContinue) {
      router.push('/onboarding/genre');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What should we call you?</Text>

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={artistName}
          onChangeText={setArtistName}
          placeholder="Your artist name"
          placeholderTextColor="#888"
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleSubmit}
          selectionColor={Colors.accent}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ContinueButton
          onPress={handleSubmit}
          disabled={!canContinue}
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: 18,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
});
