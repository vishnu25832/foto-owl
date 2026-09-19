export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  fullName: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
}

export interface RegisteredUser extends UserProfile {
  password: string;
}