const variant = process.env.APP_VARIANT;
const IS_DEV = variant === 'development';
const IS_PREVIEW = variant === 'preview';

const appName = IS_DEV
  ? 'Calitrack (Dev)'
  : IS_PREVIEW
    ? 'Calitrack (Preview)'
    : 'Calitrack';

const bundleId = IS_DEV
  ? 'com.mael_rltt.calitrackts.dev'
  : IS_PREVIEW
    ? 'com.mael_rltt.calitrackts.preview'
    : 'com.mael_rltt.calitrackts';

export default {
  name: appName,
  slug: 'calitrack-ts',
  version: '0.9.6',
  orientation: 'portrait',
  icon: './assets/images/logo-fond.png',
  scheme: 'calitrackts',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mael_rltt.calitrackts',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFF9F7',
    },
    edgeToEdgeEnabled: true,
    package: bundleId,
    googleServicesFile: './google-services.json',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/adaptive-icon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/adaptive-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FFF9F7',
        dark: {
          backgroundColor: '#FFF9F7',
        },
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          "L'application nécessite l'accès à vos photos pour que vous puissiez choisir une image de profil.",
      },
    ],
    'expo-notifications',
    '@react-native-firebase/app',
    'expo-asset',
    'expo-web-browser',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    EXPO_ROUTER_APP_ROOT: './app',
    router: {},
    eas: {
      projectId: 'aa0ea6c8-f82d-4087-a86b-4e88c39288c4',
    },
  },
};