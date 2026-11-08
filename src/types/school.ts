export type SchoolBoard =
  | 'CBSE'
  | 'ICSE'
  | 'State Board'
  | 'CISCE'
  | 'IB'
  | 'Cambridge'
  | 'Other';

export type SchoolCategory =
  | 'Co-Educational'
  | 'Girls Only'
  | 'Boys Only';

export type SchoolLevel =
  | 'K-12 (Pre-Primary to 12th)'
  | 'Primary (1st to 5th)'
  | 'Middle (6th to 8th)'
  | 'Secondary (9th to 10th)'
  | 'Senior Secondary (11th to 12th)';

export interface SchoolProfile {
  id: string;
  name: string;
  tagline?: string;
  code: string; // School / Branch Code
  udiseCode?: string; // Unified District Information System for Education (Indian Standard)
  affiliationBoard: SchoolBoard;
  affiliationNumber?: string;
  category: SchoolCategory;
  schoolLevel: SchoolLevel;
  
  // Contact & Location
  email: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string; // Indian State / UT
  pincode: string;
  country: string;

  // Key Leadership
  principalName: string;
  principalEmail?: string;
  principalPhone?: string;
  vicePrincipalName?: string;

  // Media
  logoUrl?: string;
  bannerUrl?: string;

  // Operational Settings
  academicYearStartMonth: number; // 4 = April (Standard in India)
  workingDaysPerWeek: 5 | 6;
  dailyShiftCount: 1 | 2; // Single shift vs Morning/Afternoon
  establishedYear?: number;
  
  updatedAt?: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];
