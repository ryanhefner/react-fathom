import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { FathomProvider } from 'react-fathom/native'

const SITE_ID = process.env.EXPO_PUBLIC_FATHOM_SITE_ID

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      {SITE_ID ? (
        <FathomProvider siteId={SITE_ID}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#fff' },
              headerTintColor: '#000',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'react-fathom' }} />
            <Stack.Screen name="about" options={{ title: 'About' }} />
            <Stack.Screen name="events" options={{ title: 'Events Demo' }} />
            <Stack.Screen name="docs" options={{ title: 'Documentation' }} />
          </Stack>
        </FathomProvider>
      ) : (
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'react-fathom' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="events" options={{ title: 'Events Demo' }} />
          <Stack.Screen name="docs" options={{ title: 'Documentation' }} />
        </Stack>
      )}
    </>
  )
}
