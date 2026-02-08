import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Link } from 'expo-router'

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>react-fathom</Text>
        <Text style={styles.subtitle}>React Native Example</Text>
        <Text style={styles.description}>
          Privacy-focused analytics for React Native with offline support and navigation tracking.
        </Text>
      </View>

      <View style={styles.cards}>
        <Link href="/events" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Events Demo</Text>
            <Text style={styles.cardDescription}>
              Track custom events with the useFathom hook
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/docs" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Documentation</Text>
            <Text style={styles.cardDescription}>
              Learn how to integrate react-fathom in React Native
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/about" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.cardDescription}>
              Learn about Fathom Analytics and privacy
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📱</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>React Native Support</Text>
            <Text style={styles.featureDescription}>
              Full support for iOS and Android apps
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📡</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Offline Queue</Text>
            <Text style={styles.featureDescription}>
              Events queued when offline, sent when connected
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🧭</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Navigation Tracking</Text>
            <Text style={styles.featureDescription}>
              Automatic screen tracking with React Navigation
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  cards: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  features: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
})
