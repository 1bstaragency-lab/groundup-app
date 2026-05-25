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
    const inTabs       = segments[0] === '(tabs)'
    const inAuth       = segments[0] === '(auth)'
    const atRoot       = segments.length === 0 || segments[0] === 'index'

    // Authenticated: redirect away from auth/root screens into the app
    if (user && (inAuth || atRoot)) {
      router.replace('/(tabs)/home')
      return
    }

    // Not authenticated: redirect out of protected tabs to login
    if (!user && inTabs) {
      router.replace('/(auth)/login')
    }

    // Unauthenticated users stay on root welcome screen or onboarding — no redirect needed
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
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  )
}
