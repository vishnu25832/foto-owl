import React, { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';

import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../store/authStore';
import { storage, STORAGE_KEYS } from '../../storage/storage';

import { Gender, RegisteredUser } from '../../types/auth';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

const CITIES = [
  'Hyderabad',
  'Visakhapatnam',
  'Vijayawada',
  'Tirupati',
  'Warangal',
  'Guntur',
  'Nellore',
  'Kurnool',
];

export default function RegisterScreen({
  navigation,
}: Props) {
  const register = useAuthStore(
    (state) => state.register,
  );

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] =
    useState<Gender | ''>('');

  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [cityModalVisible, setCityModalVisible] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    gender?: string;
    mobile?: string;
    address?: string;
    city?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!fullName.trim()) {
      nextErrors.fullName =
        'Full name is required';
    }

    if (!email.trim()) {
      nextErrors.email =
        'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
      )
    ) {
      nextErrors.email =
        'Enter a valid email address';
    }

    if (!gender) {
      nextErrors.gender =
        'Please select your gender';
    }

    if (!mobile) {
      nextErrors.mobile =
        'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
      nextErrors.mobile =
        'Mobile number must contain exactly 10 digits';
    }

    if (!address.trim()) {
      nextErrors.address =
        'Address is required';
    }

    if (!city) {
      nextErrors.city =
        'Please select a city';
    }

    if (!password) {
      nextErrors.password =
        'Password is required';
    } else if (password.length < 6) {
      nextErrors.password =
        'Password must contain at least 6 characters';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        'Please confirm your password';
    } else if (
      password !== confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const existingUser =
        await storage.get<RegisteredUser>(
          STORAGE_KEYS.REGISTERED_USER,
        );

      if (
        existingUser &&
        existingUser.email.toLowerCase() ===
          email.trim().toLowerCase()
      ) {
        Alert.alert(
          'Account Exists',
          'An account with this email already exists. Please login instead.',
        );

        return;
      }

      const newUser: RegisteredUser = {
        fullName: fullName.trim(),
        email: email.trim(),
        gender: gender as Gender,
        mobile,
        address: address.trim(),
        city,
        password,
      };

      await register(newUser);

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'Login',
            onPress: () =>
              navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      console.log(
        'Registration error:',
        error,
      );

      Alert.alert(
        'Registration Failed',
        'Unable to create your account. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>
            Foto Owl
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Register to start exploring photos
          </Text>
        </View>

        <AppInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          error={errors.fullName}
        />

        <AppInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
        />

        <Text style={styles.fieldLabel}>
          Gender
        </Text>

        <View style={styles.genderContainer}>
          {(
            ['Male', 'Female', 'Other'] as Gender[]
          ).map((option) => (
            <Pressable
              key={option}
              style={styles.genderOption}
              onPress={() => {
                setGender(option);

                setErrors((current) => ({
                  ...current,
                  gender: undefined,
                }));
              }}
            >
              <View style={styles.radio}>
                {gender === option ? (
                  <View
                    style={styles.radioSelected}
                  />
                ) : null}
              </View>

              <Text style={styles.genderText}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        {errors.gender ? (
          <Text style={styles.error}>
            {errors.gender}
          </Text>
        ) : null}

        <AppInput
          label="Mobile Number"
          value={mobile}
          onChangeText={(text) => {
            setMobile(
              text
                .replace(/\D/g, '')
                .slice(0, 10),
            );
          }}
          placeholder="Enter 10-digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
          error={errors.mobile}
        />

        <AppInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          multiline
          textAlignVertical="top"
          style={styles.addressInput}
          error={errors.address}
        />

        <Text style={styles.fieldLabel}>
          City
        </Text>

        <Pressable
          style={[
            styles.dropdown,
            errors.city
              ? styles.dropdownError
              : undefined,
          ]}
          onPress={() => {
            setCityModalVisible(true);
          }}
        >
          <Text
            style={[
              styles.dropdownText,
              !city && styles.placeholderText,
            ]}
          >
            {city || 'Select your city'}
          </Text>

          <Text style={styles.dropdownArrow}>
            ▼
          </Text>
        </Pressable>

        {errors.city ? (
          <Text style={styles.error}>
            {errors.city}
          </Text>
        ) : null}

        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        <AppInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <AppButton
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.loginLink}>
              {' '}Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={cityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCityModalVisible(false)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setCityModalVisible(false)
          }
        >
          <Pressable
            style={styles.modalCard}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select your city
              </Text>

              <Pressable
                onPress={() =>
                  setCityModalVisible(false)
                }
                hitSlop={10}
              >
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </Pressable>
            </View>

            {CITIES.map((option) => {
              const selected =
                city === option;

              return (
                <Pressable
                  key={option}
                  style={[
                    styles.cityOption,
                    selected &&
                      styles.cityOptionSelected,
                  ]}
                  onPress={() => {
                    setCity(option);

                    setErrors((current) => ({
                      ...current,
                      city: undefined,
                    }));

                    setCityModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.cityOptionText,
                      selected &&
                        styles.cityOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>

                  {selected ? (
                    <Text
                      style={styles.checkmark}
                    >
                      ✓
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 24,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 28,
  },

  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 7,
    fontSize: 15,
    color: '#6B7280',
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },

  genderContainer: {
    marginBottom: 8,
  },

  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },

  genderText: {
    fontSize: 15,
    color: '#374151',
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  addressInput: {
    height: 90,
    paddingTop: 12,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  dropdownError: {
    borderColor: '#DC2626',
  },

  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },

  placeholderText: {
    color: '#888888',
  },

  dropdownArrow: {
    fontSize: 13,
    color: '#6B7280',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 24,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
  },

  modalHeader: {
    height: 60,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  closeText: {
    fontSize: 20,
    color: '#6B7280',
  },

  cityOption: {
    minHeight: 55,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  cityOptionSelected: {
    backgroundColor: '#EFF6FF',
  },

  cityOptionText: {
    fontSize: 16,
    color: '#374151',
  },

  cityOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '700',
  },

  checkmark: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: '800',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#6B7280',
  },

  loginLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
});