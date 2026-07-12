# macroTrack

A React Native nutrition tracking app built with Expo. Log food items, track daily macros, and set reminders to stay consistent.

## Features

- **Food logging** — add meals with calories, protein, carbs, and fat
- **Daily macro summary** — live totals for the current day on the home screen
- **History** — bar chart of calorie intake over time
- **Saved foods** — reuse previously logged items with one tap
- **Notification settings** — inactivity reminder (alerts after X hours without logging) and a daily scheduled reminder
- **Persistent storage** — all data saved locally on device

## Requirements

- [Node.js](https://nodejs.org) (v18 or later)
- [Expo Go](https://expo.dev/go) app installed on your phone (iOS or Android)

## Running the App

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd macroTrack

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

Scan the QR code that appears in the terminal with the **Expo Go** app on your phone.

> If you are on a different network than the machine running the server, use:
> ```bash
> npx expo start --tunnel
> ```

## Tech Stack

- [Expo](https://expo.dev) SDK 54
- [Expo Router](https://expo.github.io/router) for file-based navigation
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for gesture animations
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) for local push notifications
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local persistence
- TypeScript throughout
