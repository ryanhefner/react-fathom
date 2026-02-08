import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useState } from 'react'
import { useFathom } from 'react-fathom/native'

export default function Events() {
  const { trackEvent } = useFathom()
  const [customEventName, setCustomEventName] = useState('custom-event')
  const [eventCount, setEventCount] = useState(0)

  const handleTrackEvent = (name: string, value?: number) => {
    trackEvent(name, value ? { _value: value } : undefined)
    setEventCount((c) => c + 1)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Tracking Demo</Text>
        <Text style={styles.subtitle}>
          Events tracked this session: {eventCount}
        </Text>
      </View>

      {/* Basic Event Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Event Tracking</Text>
        <Text style={styles.description}>
          Use useFathom() hook to track custom events
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => handleTrackEvent('button-click')}
          >
            <Text style={styles.buttonTextPrimary}>Track "button-click"</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleTrackEvent('signup-intent')}
          >
            <Text style={styles.buttonText}>Track "signup-intent"</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {'const { trackEvent } = useFathom()\n'}
            {'trackEvent("button-click")'}
          </Text>
        </View>
      </View>

      {/* Custom Event Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Event Name</Text>
        <Text style={styles.description}>
          Track any event name you want
        </Text>
        <TextInput
          style={styles.input}
          value={customEventName}
          onChangeText={setCustomEventName}
          placeholder="Event name"
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonPurple]}
          onPress={() => handleTrackEvent(customEventName)}
        >
          <Text style={styles.buttonTextPrimary}>Track Event</Text>
        </TouchableOpacity>
      </View>

      {/* Revenue Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Tracking</Text>
        <Text style={styles.description}>
          Track events with monetary values (in cents)
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonGreen]}
            onPress={() => handleTrackEvent('purchase', 1999)}
          >
            <Text style={styles.buttonTextPrimary}>Purchase ($19.99)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonGreen]}
            onPress={() => handleTrackEvent('subscription', 9900)}
          >
            <Text style={styles.buttonTextPrimary}>Subscription ($99)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {'trackEvent("purchase", { _value: 1999 })'}
          </Text>
        </View>
      </View>

      {/* Offline Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Support</Text>
        <Text style={styles.description}>
          Events are automatically queued when offline and sent when the device
          reconnects. Try enabling airplane mode and tracking some events!
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttons: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  buttonPurple: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  buttonGreen: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
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
})
