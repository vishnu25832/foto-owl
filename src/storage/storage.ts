import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  REGISTERED_USER: '@foto_owl_registered_user',
  SESSION: '@foto_owl_session',
  FAVORITES: '@foto_owl_favorites',
  THEME: '@foto_owl_theme',
} as const;

export const storage = {
  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};