import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  File,
  Paths,
} from 'expo-file-system';

import {
  MainStackParamList,
} from '../../navigation/MainNavigator';

type Props = NativeStackScreenProps<
  MainStackParamList,
  'ImageDetails'
>;

export default function ImageDetailsScreen({
  route,
  navigation,
}: Props) {
  const { image } = route.params;

  const [downloading, setDownloading] =
    useState(false);

  const handleDownload = async () => {
    if (downloading) {
      return;
    }

    try {
      setDownloading(true);

      // Load MediaLibrary only when downloading.
      const {
        Asset,
        requestPermissionsAsync,
      } = await import('expo-media-library');

      // Ask for gallery/media permission.
      const permission =
        await requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access to save images.',
        );

        return;
      }

      // Create a fixed local filename.
      const destinationFile = new File(
        Paths.cache,
        `foto-owl-${image.id}.jpg`,
      );

      // Download the image to the local cache.
      const downloadedFile =
        await File.downloadFileAsync(
          image.download_url,
          destinationFile,
          {
            idempotent: true,
          },
        );

      if (!downloadedFile.exists) {
        throw new Error(
          'Downloaded file does not exist.',
        );
      }

      console.log(
        'Downloaded file:',
        downloadedFile.uri,
      );

      // Save the downloaded file to the device gallery.
      await Asset.create(
        downloadedFile.uri,
      );

      Alert.alert(
        'Download Complete',
        'The image has been saved to your gallery.',
      );
    } catch (error) {
      console.log(
        'Download error:',
        error,
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : String(error);

      console.log(
        'Download error message:',
        errorMessage,
      );

      Alert.alert(
        'Download Failed',
        errorMessage ||
          'Unable to download the image. Please try again.',
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() =>
          navigation.navigate(
            'ImageViewer',
            {
              image,
            },
          )
        }
      >
        <Image
          source={{
            uri: image.download_url,
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.viewerHint}>
          <Text style={styles.viewerHintText}>
            Tap image for full screen
          </Text>
        </View>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.authorLabel}>
          Author
        </Text>

        <Text style={styles.author}>
          {image.author}
        </Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.detail}>
            <Text style={styles.label}>
              ID
            </Text>

            <Text style={styles.value}>
              {image.id}
            </Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.label}>
              Dimensions
            </Text>

            <Text style={styles.value}>
              {image.width} × {image.height}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={[
          styles.downloadButton,
          downloading &&
            styles.downloadButtonDisabled,
        ]}
        onPress={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.downloadText}>
            Download Image
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>
          Go Back
        </Text>
      </Pressable>
    </ScrollView>
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

  image: {
    width: '100%',
    height: 380,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },

  viewerHint: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: 'center',
  },

  viewerHintText: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },

  authorLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  author: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  row: {
    flexDirection: 'row',
  },

  detail: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  downloadButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  downloadButtonDisabled: {
    opacity: 0.6,
  },

  downloadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  backText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});