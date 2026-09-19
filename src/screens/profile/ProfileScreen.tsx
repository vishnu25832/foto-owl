import React, { useEffect, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { useAuthStore } from '../../store/authStore';
import { Gender } from '../../types/auth';

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

export default function ProfileScreen() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const updateProfile = useAuthStore(
    (state) => state.updateProfile,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] =
    useState<Gender>('Male');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    mobile?: string;
    address?: string;
    city?: string;
  }>({});

  useEffect(() => {
    if (!user) {
      return;
    }

    setFullName(user.fullName);
    setEmail(user.email);
    setGender(user.gender);
    setMobile(user.mobile);
    setAddress(user.address);
    setCity(user.city);
  }, [user]);

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

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const startEditing = () => {
    if (!user) {
      return;
    }

    setFullName(user.fullName);
    setEmail(user.email);
    setGender(user.gender);
    setMobile(user.mobile);
    setAddress(user.address);
    setCity(user.city);

    setErrors({});
    setEditing(true);
  };

  const cancelEditing = () => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGender(user.gender);
      setMobile(user.mobile);
      setAddress(user.address);
      setCity(user.city);
    }

    setErrors({});
    setEditing(false);
  };

  const handleSave = async () => {
    if (!user || !validate()) {
      return;
    }

    setSaving(true);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        gender,
        mobile,
        address: address.trim(),
        city,
      });

      setEditing(false);

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
      );
    } catch {
      Alert.alert(
        'Update Failed',
        'Unable to update your profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>
          No profile information available.
        </Text>
      </View>
    );
  }

  if (!editing) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.fullName
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>
            {user.fullName}
          </Text>

          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>

        <View style={styles.card}>
          <ProfileRow
            label="Full Name"
            value={user.fullName}
          />

          <ProfileRow
            label="Email"
            value={user.email}
          />

          <ProfileRow
            label="Gender"
            value={user.gender}
          />

          <ProfileRow
            label="Mobile"
            value={user.mobile}
          />

          <ProfileRow
            label="Address"
            value={user.address}
          />

          <ProfileRow
            label="City"
            value={user.city}
            last
          />
        </View>

        <AppButton
          title="Edit Profile"
          onPress={startEditing}
        />

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

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
        <Text style={styles.editTitle}>
          Edit Profile
        </Text>

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
              onPress={() =>
                setGender(option)
              }
            >
              <View style={styles.radio}>
                {gender === option && (
                  <View
                    style={
                      styles.radioSelected
                    }
                  />
                )}
              </View>

              <Text style={styles.genderText}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <AppInput
          label="Mobile Number"
          value={mobile}
          onChangeText={(text) =>
            setMobile(
              text
                .replace(/\D/g, '')
                .slice(0, 10),
            )
          }
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

        <View
          style={[
            styles.pickerContainer,
            errors.city
              ? styles.pickerError
              : undefined,
          ]}
        >
          <Picker
            selectedValue={city}
            onValueChange={(value) =>
              setCity(value)
            }
          >
            <Picker.Item
              label="Select your city"
              value=""
            />

            {CITIES.map((option) => (
              <Picker.Item
                key={option}
                label={option}
                value={option}
              />
            ))}
          </Picker>
        </View>

        {errors.city ? (
          <Text style={styles.error}>
            {errors.city}
          </Text>
        ) : null}

        <AppButton
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
        />

        <Pressable
          style={styles.cancelButton}
          onPress={cancelEditing}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface ProfileRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function ProfileRow({
  label,
  value,
  last = false,
}: ProfileRowProps) {
  return (
    <View
      style={[
        styles.profileRow,
        !last && styles.profileRowBorder,
      ]}
    >
      <Text style={styles.rowLabel}>
        {label}
      </Text>

      <Text style={styles.rowValue}>
        {value}
      </Text>
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

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },

  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  email: {
    marginTop: 4,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
  },

  profileRow: {
    paddingVertical: 15,
  },

  profileRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  rowLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  rowValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },

  logoutButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  editTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 8,
  },

  genderContainer: {
    marginBottom: 16,
  },

  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

  addressInput: {
    height: 90,
    paddingTop: 12,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 4,
  },

  pickerError: {
    borderColor: '#DC2626',
  },

  error: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  cancelButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});