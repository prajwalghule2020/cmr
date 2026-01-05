"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  currentRole: string;
  experience: string;
  skills: string[];
  interests: string[];
  goals: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  supabaseUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  hasCompletedProfile: boolean;
  setHasCompletedProfile: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setSupabaseUser(user);
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          currentRole: user.user_metadata?.currentRole || '',
          experience: user.user_metadata?.experience || '',
          skills: user.user_metadata?.skills || [],
          interests: user.user_metadata?.interests || [],
          goals: user.user_metadata?.goals || [],
        });
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            currentRole: session.user.user_metadata?.currentRole || '',
            experience: session.user.user_metadata?.experience || '',
            skills: session.user.user_metadata?.skills || [],
            interests: session.user.user_metadata?.interests || [],
            goals: session.user.user_metadata?.goals || [],
          });
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    setHasCompletedProfile(false);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setHasCompletedProfile(false);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile });
      // Optionally update Supabase user metadata
      supabase.auth.updateUser({
        data: profile,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!supabaseUser,
      user,
      supabaseUser,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      hasCompletedProfile,
      setHasCompletedProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
