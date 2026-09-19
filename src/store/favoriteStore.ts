import { create } from 'zustand';

import { storage, STORAGE_KEYS } from '../storage/storage';
import { PicsumImage } from '../types/image';

interface FavoriteState {
  favorites: PicsumImage[];
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  removeFavorite: (imageId: string) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>(
  (set, get) => ({
    favorites: [],
    isHydrated: false,

    hydrate: async () => {
      try {
        const savedFavorites =
          await storage.get<PicsumImage[]>(
            STORAGE_KEYS.FAVORITES,
          );

        set({
          favorites: savedFavorites ?? [],
          isHydrated: true,
        });
      } catch {
        set({
          favorites: [],
          isHydrated: true,
        });
      }
    },

    toggleFavorite: async (image) => {
      const currentFavorites = get().favorites;

      const alreadyFavorite =
        currentFavorites.some(
          (favorite) => favorite.id === image.id,
        );

      const updatedFavorites = alreadyFavorite
        ? currentFavorites.filter(
            (favorite) => favorite.id !== image.id,
          )
        : [...currentFavorites, image];

      await storage.set(
        STORAGE_KEYS.FAVORITES,
        updatedFavorites,
      );

      set({
        favorites: updatedFavorites,
      });
    },

    removeFavorite: async (imageId) => {
      const updatedFavorites =
        get().favorites.filter(
          (favorite) => favorite.id !== imageId,
        );

      await storage.set(
        STORAGE_KEYS.FAVORITES,
        updatedFavorites,
      );

      set({
        favorites: updatedFavorites,
      });
    },
  }),
);