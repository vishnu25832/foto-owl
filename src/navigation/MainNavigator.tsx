import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ImageDetailsScreen from '../screens/home/ImageDetailsScreen';
import ImageViewerScreen from '../screens/home/ImageViewerScreen';

import { PicsumImage } from '../types/image';

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;

  ImageDetails: {
    image: PicsumImage;
  };

  ImageViewer: {
    image: PicsumImage;
  };
};

const Stack =
  createNativeStackNavigator<MainStackParamList>();

const Tab =
  createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ImageDetails"
        component={ImageDetailsScreen}
        options={{
          title: 'Image Details',
        }}
      />

      <Stack.Screen
        name="ImageViewer"
        component={ImageViewerScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
}