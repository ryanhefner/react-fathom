import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native'

export default function Docs() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Documentation</Text>
        <Text style={styles.description}>
          How to integrate react-fathom into your React Native application.
        </Text>
      </View>

      {/* Installation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Installation</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            npm install react-fathom react-native-webview
          </Text>
        </View>
      </View>

      {/* Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Setup</Text>
        <Text style={styles.description}>
          Wrap your app with FathomProvider from react-fathom/native:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {`import { FathomProvider } from 'react-fathom/native'

function App() {
  return (
    <FathomProvider siteId="YOUR_SITE_ID">
      <YourApp />
    </FathomProvider>
  )
}`}
          </Text>
        </View>
      </View>

      {/* Event Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Tracking</Text>
        <Text style={styles.description}>
          Use the useFathom hook to track events:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {`import { useFathom } from 'react-fathom/native'

function MyComponent() {
  const { trackEvent } = useFathom()

  return (
    <Button
      title="Sign Up"
      onPress={() => trackEvent('signup-click')}
    />
  )
}`}
          </Text>
        </View>
      </View>

      {/* Navigation Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Tracking</Text>
        <Text style={styles.description}>
          Track screen views with React Navigation:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {`import { useNavigationTracking } from 'react-fathom/native'

function App() {
  const navigationRef = useNavigationContainerRef()

  useNavigationTracking(navigationRef)

  return (
    <NavigationContainer ref={navigationRef}>
      {/* screens */}
    </NavigationContainer>
  )
}`}
          </Text>
        </View>
      </View>

      {/* Offline Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Support</Text>
        <Text style={styles.description}>
          react-fathom automatically queues events when the device is offline and
          sends them when connectivity is restored. No additional configuration needed.
        </Text>
      </View>

      {/* Environment Variables */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environment Variables</Text>
        <Text style={styles.description}>
          Store your site ID in an environment variable:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {'# .env\n'}
            {'EXPO_PUBLIC_FATHOM_SITE_ID=YOUR_SITE_ID'}
          </Text>
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learn More</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://react-fathom.com/docs/react-native')}
        >
          <Text style={styles.link}>Full Documentation →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://react-fathom.com/docs/api/native')}
        >
          <Text style={styles.link}>API Reference →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://github.com/ryanhefner/react-fathom')}
        >
          <Text style={styles.link}>GitHub Repository →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  codeBlock: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#e5e5e5',
  },
  link: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 12,
  },
})
