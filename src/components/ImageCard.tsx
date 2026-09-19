import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PicsumImage } from '../types/image';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

export default function ImageCard({
  image,
  isFavorite,
  onPress,
  onFavoritePress,
}: ImageCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text
            style={styles.author}
            numberOfLines={1}
          >
            {image.author}
          </Text>

          <Text style={styles.id}>
            ID: {image.id}
          </Text>
        </View>

        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
            onFavoritePress();
          }}
          hitSlop={10}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 220,
  },

  info: {
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textContainer: {
    flex: 1,
    marginRight: 10,
  },

  author: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  id: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  favoriteIcon: {
    fontSize: 24,
    color: '#DC2626',
  },
});