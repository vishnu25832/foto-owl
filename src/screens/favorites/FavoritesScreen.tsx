import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ImageCard from '../../components/ImageCard';
import SearchBar from '../../components/SearchBar';
import { useFavoriteStore } from '../../store/favoriteStore';

export default function FavoritesScreen() {
  const favorites = useFavoriteStore(
    (state) => state.favorites,
  );

  const removeFavorite = useFavoriteStore(
    (state) => state.removeFavorite,
  );

  const [search, setSearch] = useState('');

  const filteredFavorites = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return favorites;
    }

    return favorites.filter((image) =>
      image.author
        .toLowerCase()
        .includes(searchText),
    );
  }, [favorites, search]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              Favorites
            </Text>

            <Text style={styles.subtitle}>
              {favorites.length}{' '}
              {favorites.length === 1
                ? 'photo'
                : 'photos'}{' '}
              saved
            </Text>

            <SearchBar
              value={search}
              onChangeText={setSearch}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            isFavorite={true}
            onPress={() => {}}
            onFavoritePress={() =>
              removeFavorite(item.id)
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ♡
            </Text>

            <Text style={styles.emptyTitle}>
              No favorites yet
            </Text>

            <Text style={styles.emptyText}>
              Add photos to your favorites from
              the Home screen.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {}}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 18,
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },

  emptyIcon: {
    fontSize: 50,
    color: '#9CA3AF',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});