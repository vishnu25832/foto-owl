import { create } from 'zustand';
import { RegisteredUser, UserProfile } from '../types/auth';
import { storage, STORAGE_KEYS } from '../storage/storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  register: (user: RegisteredUser) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  register: async (user) => {
    await storage.set(STORAGE_KEYS.REGISTERED_USER, user);

    set({
      user: {
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        mobile: user.mobile,
        address: user.address,
        city: user.city,
      },
      isAuthenticated: false,
    });
  },

  login: async (email, password) => {
    const registeredUser =
      await storage.get<RegisteredUser>(
        STORAGE_KEYS.REGISTERED_USER,
      );

    if (!registeredUser) {
      return false;
    }

    const credentialsMatch =
      registeredUser.email.toLowerCase() === email.trim().toLowerCase() &&
      registeredUser.password === password;

    if (!credentialsMatch) {
      return false;
    }

    const profile: UserProfile = {
      fullName: registeredUser.fullName,
      email: registeredUser.email,
      gender: registeredUser.gender,
      mobile: registeredUser.mobile,
      address: registeredUser.address,
      city: registeredUser.city,
    };

    await storage.set(STORAGE_KEYS.SESSION, profile);

    set({
      user: profile,
      isAuthenticated: true,
    });

    return true;
  },

  updateProfile: async (profile) => {
    const registeredUser =
      await storage.get<RegisteredUser>(
        STORAGE_KEYS.REGISTERED_USER,
      );

    if (!registeredUser) {
      return;
    }

    const updatedUser: RegisteredUser = {
      ...registeredUser,
      ...profile,
    };

    await storage.set(
      STORAGE_KEYS.REGISTERED_USER,
      updatedUser,
    );

    await storage.set(
      STORAGE_KEYS.SESSION,
      profile,
    );

    set({
      user: profile,
    });
  },

  logout: async () => {
    await storage.remove(STORAGE_KEYS.SESSION);

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: async () => {
    try {
      const session =
        await storage.get<UserProfile>(
          STORAGE_KEYS.SESSION,
        );

      set({
        user: session,
        isAuthenticated: session !== null,
        isHydrated: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },
}));