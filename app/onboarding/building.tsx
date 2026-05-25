import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../../store/onboarding';
import { Colors } from '../../constants/theme';

export default function BuildingScreen() {
  const { artistName } = useOnboardingStore();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/onboarding/reveal');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const headline = artistName
    ? `Building your plan, ${artistName}...`
    : 'Building your plan...';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.spinner, { transform: [{ rotate: spin }] }]}
      />
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.subtext}>Tailoring everything to your answers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#F5C518',
    borderTopColor: 'transparent',
    marginBottom: 24,
  },
  headline: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
  },
});
