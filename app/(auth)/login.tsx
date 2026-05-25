import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme'

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin() {
    if (!email || !password) { setError('Enter your email and password.'); return }
    setError('')
    setLoading(true)
    const result = await signIn(email.trim().toLowerCase(), password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    router.replace('/(tabs)/home')
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        style={s.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Logo mark */}
        <View style={s.logoWrap}>
          <View style={s.logoDot} />
          <Text style={s.logoText}>GrounduP</Text>
        </View>

        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to your Artist OS</Text>

        <View style={s.form}>
          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={Colors.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={Colors.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={s.btnText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/onboarding/name')} style={s.switchRow}>
            <Text style={s.switchText}>No account? <Text style={s.switchLink}>Get started free →</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center', gap: Spacing.sm },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.md },
  logoDot: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.accent },
  logoText: { color: Colors.white, fontSize: 15, fontWeight: '900', letterSpacing: -0.3 },
  title: { color: Colors.white, fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: Colors.secondary, fontSize: FontSize.sm, marginTop: -Spacing.xs },
  form: { gap: Spacing.sm, marginTop: Spacing.md },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    color: Colors.white,
    fontSize: FontSize.sm,
  },
  error: { color: '#EF4444', fontSize: 12, textAlign: 'center' },
  btn: {
    backgroundColor: Colors.accent,
    height: 54,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#000', fontSize: FontSize.md, fontWeight: '800' },
  switchRow: { alignItems: 'center', paddingVertical: Spacing.sm },
  switchText: { color: Colors.secondary, fontSize: 13 },
  switchLink: { color: Colors.accent, fontWeight: '700' },
})
