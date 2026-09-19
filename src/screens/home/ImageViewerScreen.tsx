import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  MainStackParamList,
} from '../../navigation/MainNavigator';

type Props = NativeStackScreenProps<
  MainStackParamList,
  'ImageViewer'
>;

export default function ImageViewerScreen({
  route,
  navigation,
}: Props) {
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: image.download_url,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      <Pressable
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>
          ✕
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});