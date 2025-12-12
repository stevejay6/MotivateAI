import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "QuotesDiscoveryMobile",
  slug: "quotes-discovery-mobile",
  scheme: "quotesdiscovery",
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
  },
  android: {
    ...config.android,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    // Keep edge-to-edge and predictive back sane defaults for Expo Go
    edgeToEdgeEnabled: true,
    permissions: [],
  },
  web: {
    ...config.web,
    favicon: "./assets/favicon.png",
  },
});

