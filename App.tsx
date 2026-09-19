import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';

import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/store/authStore';
import { useFavoriteStore } from './src/store/favoriteStore';

export default function App() {
  const hydrateAuth = useAuthStore(
    (state) => state.hydrate,
  );

  const hydrateFavorites = useFavoriteStore(
    (state) => state.hydrate,
  );

  useEffect(() => {
    hydrateAuth();
    hydrateFavorites();
  }, [hydrateAuth, hydrateFavorites]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}