# Quotes Discovery Mobile (Expo)

Expo-managed React Native app targeting iOS and Android, migrated from the Next.js web experience.

## Setup

1) Install dependencies
```
npm install
```

2) Configure Supabase (required for live data)
Create a `.env` file in `mobile/`:
```
SUPABASE_URL=your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

3) Run the app
```
npm run start
# or
npm run android
npm run ios
```

## Notes
- Uses React Navigation (bottom tabs) with screens for Quotes, Affirmations, Emotional Coach, AI Journal, Motivate Me Now, and Kick in the Pants.
- Supabase client is initialized from `Constants.expoConfig.extra` (see `app.config.js`).
- Gesture handler and Reanimated are configured via `babel.config.js`.

## Testing and release
- Quick smoke tests: run `npm run start`, open on device/simulator, and exercise each tab (search, category filter, send messages, add/update/delete journal entries).
- OTA updates: configure EAS with `npx expo install expo-updates` and run `eas update --branch main --message "desc"`.
- Builds: run `eas build -p ios` or `eas build -p android` (requires Expo account and configured credentials).

