import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing, Radius, FontSize } from '../constants/theme'

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.content}>
        <Text style={s.icon}>◈</Text>
        <Text style={s.title}>Page not found</Text>
        <Text style={s.sub}>This screen doesn't exist.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={s.btnText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl },
  icon:    { color: Colors.accent, fontSize: 40, opacity: 0.4 },
  title:   { color: Colors.white, fontSize: FontSize.xl, fontWeight: '900' },
  sub:     { color: Colors.secondary, fontSize: 14 },
  btn:     { backgroundColor: Colors.accent, borderRadius: Radius.lg, paddingHorizontal: Spacing.xl, paddingVertical: 14, marginTop: Spacing.sm },
  btnText: { color: '#000', fontSize: 14, fontWeight: '800' },
})
