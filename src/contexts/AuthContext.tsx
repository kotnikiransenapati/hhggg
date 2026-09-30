import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

// In-memory cache for Google OAuth Access Token (strictly not stored in localStorage)
let cachedGoogleAccessToken: string | null = null;
export const getCachedGoogleAccessToken = (): string | null => cachedGoogleAccessToken;

interface UserProfile {
  id?: number;
  uid: string;
  email: string;
  name?: string;
  photoUrl?: string;
  address?: string;
  escrowBalance?: number;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  token: string | null;
  googleAccessToken: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ user: User; accessToken: string | null }>;
  signInWithRole: (role: 'customer' | 'farmer' | 'admin' | 'wholesaler', customName?: string, customEmail?: string) => Promise<void>;
  signInWithEmail: (email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  token: null,
  googleAccessToken: null,
  isLoading: true,
  signInWithGoogle: async () => ({ user: null as any, accessToken: null }),
  signInWithRole: async () => {},
  signInWithEmail: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore simulated role account if stored
  useEffect(() => {
    try {
      const storedRoleUser = localStorage.getItem('farmdirect_custom_user');
      if (storedRoleUser && !user) {
        const parsed = JSON.parse(storedRoleUser);
        setUserProfile(parsed);
        setUser({
          uid: parsed.uid,
          email: parsed.email,
          displayName: parsed.name,
          photoURL: parsed.photoUrl || null,
          getIdToken: async () => `custom-token-${parsed.uid}`,
        } as any);
      }
    } catch (e) {
      console.warn('Failed restoring custom user:', e);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          // Synchronize user to PostgreSQL database
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              name: currentUser.displayName,
              photoUrl: currentUser.photoURL,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data.user);
          }
        } catch (err) {
          console.error('Error synchronizing auth user to database:', err);
        }
      } else {
        const storedRoleUser = localStorage.getItem('farmdirect_custom_user');
        if (!storedRoleUser) {
          setUser(null);
          setToken(null);
          cachedGoogleAccessToken = null;
          setGoogleAccessToken(null);
          setUserProfile(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      localStorage.removeItem('farmdirect_custom_user');
      const result = await signInWithPopup(auth, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || null;
      if (accessToken) {
        cachedGoogleAccessToken = accessToken;
        setGoogleAccessToken(accessToken);
      }
      return { user: result.user, accessToken };
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw error;
    }
  };

  const signInWithRole = async (
    role: 'customer' | 'farmer' | 'admin' | 'wholesaler',
    customName?: string,
    customEmail?: string
  ) => {
    const roleProfiles: Record<string, UserProfile> = {
      customer: {
        uid: 'user-patron-01',
        name: customName || 'Priya Sharma',
        email: customEmail || 'priya.sharma@farmdirect.internal',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        address: 'Flat 402, Sea Green Apts, Perry Cross Rd, Bandra West, Mumbai 400050',
        escrowBalance: 12400,
        role: 'customer',
      },
      farmer: {
        uid: 'farmer-ramesh',
        name: customName || 'Ramesh Patel',
        email: customEmail || 'ramesh.patel@sahyadrisindicate.in',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
        address: 'Survey No. 42, Dindori Agro-Cluster, Nashik, Maharashtra 422202',
        escrowBalance: 184200,
        role: 'farmer',
      },
      admin: {
        uid: 'admin-governance',
        name: customName || 'Aditi Roy (Lead Controller)',
        email: customEmail || 'aditi.roy@farmdirect.internal',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        address: 'Central Logistics Command, Bandra-Kurla Complex (BKC), Mumbai',
        escrowBalance: 2450000,
        role: 'admin',
      },
      wholesaler: {
        uid: 'wholesaler-taj',
        name: customName || 'Vikramaditya Shinde (Taj Procurement)',
        email: customEmail || 'procurement@tajhotels.com',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        address: 'Taj Lands End Commercial Receiving Bay, Bandra West, Mumbai 400050',
        escrowBalance: 250000,
        role: 'wholesaler',
      },
    };

    const targetProfile = roleProfiles[role];
    localStorage.setItem('farmdirect_custom_user', JSON.stringify(targetProfile));
    setUserProfile(targetProfile);
    setUser({
      uid: targetProfile.uid,
      email: targetProfile.email,
      displayName: targetProfile.name,
      photoURL: targetProfile.photoUrl || null,
      getIdToken: async () => `role-token-${targetProfile.uid}`,
    } as any);

    // Sync to PostgreSQL backend
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer role-token-${targetProfile.uid}`,
        },
        body: JSON.stringify({
          name: targetProfile.name,
          photoUrl: targetProfile.photoUrl,
        }),
      });
    } catch (e) {
      console.warn('Backend sync for role login notice:', e);
    }
  };

  const signInWithEmail = async (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || cleanEmail.split('@')[0];
    const profile: UserProfile = {
      uid: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      name: cleanName,
      address: 'Delivery address pending update',
      escrowBalance: 0,
      role: 'customer',
    };
    localStorage.setItem('farmdirect_custom_user', JSON.stringify(profile));
    setUserProfile(profile);
    setUser({
      uid: profile.uid,
      email: profile.email,
      displayName: profile.name,
      photoURL: null,
      getIdToken: async () => `email-token-${profile.uid}`,
    } as any);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('farmdirect_custom_user');
      await firebaseSignOut(auth);
      cachedGoogleAccessToken = null;
      setGoogleAccessToken(null);
      setUser(null);
      setUserProfile(null);
      setToken(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      setUser(null);
      setUserProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        token,
        googleAccessToken,
        isLoading,
        signInWithGoogle,
        signInWithRole,
        signInWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
