# react-fathom React Native Example

A demonstration of integrating react-fathom into a React Native application using Expo.

## Live Demo

Visit [native.react-fathom.com](https://native.react-fathom.com) to see the web version of this example.

## Features

- **Offline Event Queue** — Events are queued when offline and sent when connected
- **Navigation Tracking** — Automatic screen tracking with Expo Router
- **Custom Event Tracking** — Track user interactions with `useFathom` hook
- **Revenue Tracking** — Track events with monetary values

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ryanhefner/react-fathom.git
   cd react-fathom/examples/react-native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Fathom site ID:
   ```bash
   EXPO_PUBLIC_FATHOM_SITE_ID=YOUR_SITE_ID
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your device or simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Project Structure

```
app/
├── _layout.tsx    # Root layout with FathomProvider
├── index.tsx      # Home screen
├── about.tsx      # About screen
├── docs.tsx       # Documentation screen
└── events.tsx     # Event tracking demo
```

## React Native Specific Features

### Offline Support

Events are automatically queued when the device is offline:

```tsx
// Events track normally - they'll be queued if offline
trackEvent('user-action')
```

### Navigation Tracking

Track screen views with React Navigation:

```tsx
import { useNavigationTracking } from 'react-fathom/native'

function App() {
  const navigationRef = useNavigationContainerRef()
  useNavigationTracking(navigationRef)

  return <NavigationContainer ref={navigationRef}>...</NavigationContainer>
}
```

### App State Tracking

Track when the app enters foreground/background:

```tsx
import { useAppStateTracking } from 'react-fathom/native'

function App() {
  useAppStateTracking({
    foregroundEventName: 'app-opened',
    backgroundEventName: 'app-closed',
  })

  return <YourApp />
}
```

## Learn More

- [react-fathom Documentation](https://react-fathom.com/docs/react-native)
- [Fathom Analytics](https://usefathom.com/ref/EKONBS)
- [Expo Documentation](https://docs.expo.dev)
