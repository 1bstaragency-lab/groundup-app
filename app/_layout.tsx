import { useEffect } from 'react'
import { Stack, router, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { Colors } from '../constants/theme'

function AuthGate() {
  const { user, loading } = useAuth()
  const segments = useSegments()

  useEffect(() => {
    if (loading) return
    const inTabs = segments[0] === '(tabs)'
    const inAuth = segments[0] === '(auth)'

    if (!user && inTabs) {
      router.replace('/(auth)/login')
    } else if (user && (inAuth || segments[0] === undefined || segments.length === 0)) {
      router.replace('/(tabs)/home')
    }
  }, [user, loading, segments])

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </AuthProvider>
  )
}
