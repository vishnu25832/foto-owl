# Foto Owl 🦉

Foto Owl is a React Native photo gallery application built with TypeScript. It uses the Picsum Photos API to display images and provides features such as search, filtering, infinite scrolling, favorites, image details, image downloading, authentication, and profile management.

## Features

### Authentication

* User registration with form validation
* Login using locally stored user details
* Persistent login session
* Logout
* Profile information storage

### Home Gallery

* Picsum Photos API integration
* Image gallery using `FlatList`
* Author search
* Case-insensitive search
* A-M and N-Z author filters
* Search and filter together
* Infinite scrolling
* Pull-to-refresh
* Loading and error states
* Retry option

### Favorites

* Add and remove favorites
* Persistent favorites using AsyncStorage
* Search favorites by author
* Open favorite images in the details screen

### Image Details

* Display image, author, and ID
* Full-screen image viewer
* Download images to the device gallery

### Profile

* View profile information
* Edit profile
* Update gender, mobile, address, and city
* Persist profile changes
* Logout

## Tech Stack

* React Native
* Expo
* TypeScript
* React Navigation
* Zustand
* AsyncStorage
* Axios
* Expo File System
* Expo Media Library

## API Used

This project uses the **Picsum Photos API**.

**Endpoint:**

```text
https://picsum.photos/v2/list
```

**Example:**

```text
https://picsum.photos/v2/list?page=1&limit=20
```

| Parameter | Description               |
| --------- | ------------------------- |
| `page`    | Page number               |
| `limit`   | Number of images to fetch |

The API implementation is located in:

```text
src/api/picsumApi.ts
```

## State Management

The project uses **Zustand** for centralized state management.

```text
src/store/authStore.ts
src/store/favoriteStore.ts
```

* `authStore` handles registration, login, logout, sessions, and profile updates.
* `favoriteStore` handles adding, removing, and persisting favorite images.

## Local Storage

AsyncStorage is used to persist:

* Registered user information
* Login session
* Favorite images
* Profile updates

The storage helper is located at:

```text
src/storage/storage.ts
```

## Project Structure

```text
foto-owl/
├── assets/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   │   ├── auth/
│   │   ├── favorites/
│   │   ├── home/
│   │   └── profile/
│   ├── storage/
│   ├── store/
│   └── types/
├── App.tsx
├── app.json
├── eas.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/vishnu25832/foto-owl.git
cd foto-owl
```

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npx expo start
```

For the development build:

```bash
npx expo start --dev-client
```

The application can be tested using a physical Android device.

## Test Credentials

```text
Email: demo@fotoowl.com
Password: fotoowl123
```

## Assumptions

* Authentication is implemented locally because a backend authentication service was not required.
* User and favorite data are stored using AsyncStorage.
* Picsum Photos does not require an API key.
* Image downloads require media library permission.
* The application was tested on a physical Android device.

## Libraries Used

```text
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
@react-native-async-storage/async-storage
zustand
axios
expo-file-system
expo-media-library
react-native-screens
react-native-safe-area-context
```

## Author

**Vishnu Vardhan**

GitHub:
[https://github.com/vishnu25832](https://github.com/vishnu25832)

---