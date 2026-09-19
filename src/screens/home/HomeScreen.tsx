import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CompositeNavigationProp,
} from '@react-navigation/native';

import {
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  MainStackParamList,
  MainTabParamList,
} from '../../navigation/MainNavigator';

import ImageCard from '../../components/ImageCard';
import SearchBar from '../../components/SearchBar';
import FilterTabs from '../../components/FilterTabs';

import { useGallery } from '../../hooks/useGallery';
import { useAuthStore } from '../../store/authStore';
import { useFavoriteStore } from '../../store/favoriteStore';
import { ImageFilter } from '../../types/image';

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<
    MainTabParamList,
    'Home'
  >,
  NativeStackNavigationProp<MainStackParamList>
>;

type Props = {
  navigation: HomeNavigationProp;
};

export default function HomeScreen({
  navigation,
}: Props) {
  const {
    images,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMore,
    refresh,
    retry,
  } = useGallery();

  const user = useAuthStore(
    (state) => state.user,
  );

  const favorites = useFavoriteStore(
    (state) => state.favorites,
  );

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite,
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] =
    useState<ImageFilter>('ALL');

  const filteredImages = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return images.filter((image) => {
      const matchesSearch =
        !searchText ||
        image.author
          .toLowerCase()
          .includes(searchText);

      const firstLetter =
        image.author
          .trim()
          .charAt(0)
          .toUpperCase();

      let matchesFilter = true;

      if (filter === 'A_M') {
        matchesFilter =
          firstLetter >= 'A' &&
          firstLetter <= 'M';
      }

      if (filter === 'N_Z') {
        matchesFilter =
          firstLetter >= 'N' &&
          firstLetter <= 'Z';
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [images, search, filter]);

  if (loading && images.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading images...
        </Text>
      </View>
    );
  }

  if (error && images.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load images
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Text
          style={styles.retry}
          onPress={retry}
        >
          Tap here to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            isFavorite={favorites.some(
              (favorite) =>
                favorite.id === item.id,
            )}
            onPress={() =>
              navigation.navigate(
                'ImageDetails',
                {
                  image: item,
                },
              )
            }
            onFavoritePress={() =>
              toggleFavorite(item)
            }
          />
        )}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.fullName || 'User'} 👋
            </Text>

            <Text style={styles.title}>
              Explore Photos
            </Text>

            <SearchBar
              value={search}
              onChangeText={setSearch}
            />

            <FilterTabs
              selectedFilter={filter}
              onFilterChange={setFilter}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No images found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search or filter.
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator />

              <Text style={styles.footerText}>
                Loading more...
              </Text>
            </View>
          ) : null
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

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  errorText: {
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
  },

  retry: {
    marginTop: 16,
    color: '#2563EB',
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 6,
    color: '#6B7280',
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  footerText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
});