import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default function RootNavigator() {
  const isHydrated = useAuthStore(
    (state) => state.isHydrated,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? (
    <MainNavigator />
  ) : (
    <AuthNavigator />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});