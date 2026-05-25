import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../../constants/theme'

type IconName = 'home' | 'chat' | 'releases' | 'analytics' | 'profile'

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const icons: Record<IconName, string> = {
    home:      '⊡',
    chat:      '✦',
    releases:  '◈',
    analytics: '▲',
    profile:   '○',
  }
  return (
    <View style={[s.iconWrap, focused && s.iconWrapActive]}>
      <Text style={[s.icon, focused && s.iconActive]}>{icons[name]}</Text>
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: s.bar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarLabelStyle: s.label,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'uP', tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} /> }}
      />
      <Tabs.Screen
        name="releases"
        options={{ title: 'Releases', tabBarIcon: ({ focused }) => <TabIcon name="releases" focused={focused} /> }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ title: 'Analytics', tabBarIcon: ({ focused }) => <TabIcon name="analytics" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} /> }}
      />
    </Tabs>
  )
}

const s = StyleSheet.create({
  bar: {
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 84,
    paddingBottom: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(245,197,24,0.12)',
  },
  icon: {
    fontSize: 16,
    color: Colors.secondary,
  },
  iconActive: {
    color: Colors.accent,
  },
})
