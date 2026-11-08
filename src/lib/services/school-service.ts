/**
 * School Profile Service
 * 
 * Loosely coupled service for School Setup & Profile configuration.
 * Prepared to connect with backend REST/Supabase endpoints.
 */

import { SchoolProfile } from '@/types/school';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  id: 'sch_dpa_01',
  name: 'Delhi Public Academy',
  tagline: 'Excellence in Education & Character Building',
  code: 'DPA-ND-104',
  udiseCode: '07080104523', // Standard Indian U-DISE Code
  affiliationBoard: 'CBSE',
  affiliationNumber: 'CBSE/AFF/2024/213089',
  category: 'Co-Educational',
  schoolLevel: 'K-12 (Pre-Primary to 12th)',
  
  email: 'info@delhipublicacademy.edu.in',
  phone: '+91 11 2678 9000',
  alternatePhone: '+91 98100 12345',
  website: 'https://www.delhipublicacademy.edu.in',
  
  addressLine1: 'Plot No. 12, Institutional Area, Sector 4',
  addressLine2: 'Near Metro Station, Dwarka',
  city: 'New Delhi',
  state: 'Delhi (NCT)',
  pincode: '110078',
  country: 'India',

  principalName: 'Dr. Rajesh Sharma, Ph.D.',
  principalEmail: 'principal@delhipublicacademy.edu.in',
  principalPhone: '+91 98765 43210',
  vicePrincipalName: 'Mrs. Sunita Verma, M.Sc. M.Ed.',

  logoUrl: '',
  bannerUrl: '',

  academicYearStartMonth: 4, // April
  workingDaysPerWeek: 6,
  dailyShiftCount: 1,
  establishedYear: 1998,
  updatedAt: new Date().toISOString(),
};

let currentSchoolProfile: SchoolProfile = { ...INITIAL_SCHOOL_PROFILE };

export const SchoolService = {
  async getProfile(): Promise<SchoolProfile> {
    // Simulating slight network latency
    await new Promise((res) => setTimeout(res, 200));
    return { ...currentSchoolProfile };
  },

  async updateProfile(updates: Partial<SchoolProfile>): Promise<SchoolProfile> {
    await new Promise((res) => setTimeout(res, 400));
    currentSchoolProfile = {
      ...currentSchoolProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...currentSchoolProfile };
  },

  async resetToDefaults(): Promise<SchoolProfile> {
    currentSchoolProfile = { ...INITIAL_SCHOOL_PROFILE };
    return { ...currentSchoolProfile };
  },
};

export const schoolService = SchoolService;

