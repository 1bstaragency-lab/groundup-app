import { Stack, usePathname } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/theme';
import ProgressBar from '../../components/ProgressBar';

const SCREEN_ORDER = [
  '/onboarding/name',
  '/onboarding/genre',
  '/onboarding/stage',
  '/onboarding/goals',
  '/onboarding/building',
  '/onboarding/reveal',
];

const NO_PROGRESS_SCREENS = ['/onboarding/building', '/onboarding/reveal'];

export default function OnboardingLayout() {
  const pathname = usePathname();
  const currentIndex = SCREEN_ORDER.indexOf(pathname);
  const showProgress = currentIndex >= 0 && !NO_PROGRESS_SCREENS.includes(pathname);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {showProgress && (
        <View style={styles.progressContainer}>
          <ProgressBar current={currentIndex + 1} total={SCREEN_ORDER.length} />
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
});
