import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native'

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>About This Example</Text>
        <Text style={styles.description}>
          This is a demonstration of react-fathom integration in a React Native
          application using Expo.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tech Stack</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Expo — React Native framework</Text>
          <Text style={styles.listItem}>• Expo Router — File-based routing</Text>
          <Text style={styles.listItem}>• React Native — Mobile UI</Text>
          <Text style={styles.listItem}>• react-fathom — Privacy-focused analytics</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Fathom Analytics?</Text>
        <Text style={styles.description}>
          Fathom Analytics is a privacy-focused alternative to traditional analytics
          that respects user privacy while still providing valuable insights.
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• No cookies required — GDPR compliant</Text>
          <Text style={styles.listItem}>• No personal data collection</Text>
          <Text style={styles.listItem}>• Simple, actionable dashboard</Text>
          <Text style={styles.listItem}>• Fast and lightweight</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>React Native Features</Text>
        <Text style={styles.description}>
          react-fathom provides special features for React Native:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Offline event queue — events sent when online</Text>
          <Text style={styles.listItem}>• Navigation tracking — automatic screen tracking</Text>
          <Text style={styles.listItem}>• App state tracking — foreground/background events</Text>
          <Text style={styles.listItem}>• Hidden WebView — no visible UI component</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://usefathom.com/ref/EKONBS')}
        >
          <Text style={styles.link}>Try Fathom Analytics (Get $10 credit) →</Text>
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
  list: {
    gap: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  link: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
})
