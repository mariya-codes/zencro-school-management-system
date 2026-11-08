'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { UserProfile, UserRole, ROLE_PERMISSIONS, RolePermissions, ApiMeResponse } from '@/types/auth';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthContextType {
  user: UserProfile | null;
  school: { id: string; name: string } | null;
  role: UserRole;
  permissions: RolePermissions;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signInWithPassword: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getMePayload: () => ApiMeResponse;
}

const DEFAULT_SCHOOL = {
  id: 'sch_dpa_01',
  name: 'Delhi Public Academy',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'Dr. Rajesh Sharma',
  email: 'admin@delhipublicacademy.edu.in',
  role: 'admin',
  school_id: 'sch_dpa_01',
  phone: '+91 98765 43210',
  designation: 'Director & School Administrator',
  avatarUrl: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [school, setSchool] = useState<{ id: string; name: string } | null>(DEFAULT_SCHOOL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // If Supabase is configured, hook into Supabase Auth lifecycle
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const role = (session.user.user_metadata?.role as UserRole) || 'admin';
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: role,
              school_id: session.user.user_metadata?.school_id || DEFAULT_SCHOOL.id,
              phone: session.user.user_metadata?.phone,
              designation: session.user.user_metadata?.designation,
            });
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const role = (session.user.user_metadata?.role as UserRole) || 'admin';
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: role,
              school_id: session.user.user_metadata?.school_id || DEFAULT_SCHOOL.id,
            });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, []);

  const signInWithPassword = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: password || '',
          });
          if (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (data.user) {
            const role = (data.user.user_metadata?.role as UserRole) || 'admin';
            setUser({
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || email.split('@')[0],
              role: role,
              school_id: data.user.user_metadata?.school_id || DEFAULT_SCHOOL.id,
            });
          }
        }
      } else {
        // Fallback frontend auth simulation for Days 1–7
        await new Promise((resolve) => setTimeout(resolve, 400));
        let assignedRole: UserRole = 'admin';
        if (email.includes('teacher')) assignedRole = 'teacher';
        else if (email.includes('principal')) assignedRole = 'principal';
        else if (email.includes('accountant')) assignedRole = 'accountant';
        else if (email.includes('parent')) assignedRole = 'parent';
        else assignedRole = 'admin';

        setUser({
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          role: assignedRole,
          school_id: DEFAULT_SCHOOL.id,
          phone: '+91 98765 43210',
          designation:
            assignedRole === 'admin'
              ? 'School Administrator'
              : assignedRole === 'principal'
              ? 'Principal'
              : assignedRole === 'teacher'
              ? 'Faculty Teacher'
              : assignedRole === 'accountant'
              ? 'Chief Accountant'
              : 'Parent / Guardian',
        });
        setSchool(DEFAULT_SCHOOL);
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'Authentication failed' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    setIsLoading(false);
  };

  const switchRole = (newRole: UserRole) => {
    startTransition(() => {
      setUser((prev) => {
        if (!prev) {
          return {
            ...DEFAULT_USER,
            role: newRole,
          };
        }
        return {
          ...prev,
          role: newRole,
          designation:
            newRole === 'admin'
              ? 'School Administrator'
              : newRole === 'principal'
              ? 'Principal'
              : newRole === 'teacher'
              ? 'Senior Secondary Teacher'
              : newRole === 'accountant'
              ? 'Chief Accountant'
              : 'Parent / Guardian',
        };
      });
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const getMePayload = (): ApiMeResponse => {
    return {
      user: {
        id: user?.id || DEFAULT_USER.id,
        name: user?.name || DEFAULT_USER.name,
        email: user?.email || DEFAULT_USER.email,
        role: user?.role || DEFAULT_USER.role,
        school_id: user?.school_id || DEFAULT_SCHOOL.id,
      },
      school: {
        id: school?.id || DEFAULT_SCHOOL.id,
        name: school?.name || DEFAULT_SCHOOL.name,
      },
    };
  };

  const role = user?.role || 'admin';
  const permissions = ROLE_PERMISSIONS[role];

  return (
    <AuthContext.Provider
      value={{
        user,
        school,
        role,
        permissions,
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        signInWithPassword,
        signOut,
        switchRole,
        updateProfile,
        getMePayload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
