"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  googleProvider,
  db,
  firebaseAvailable,
} from "../../../lib/firebase";
import type { UserProfile } from "../../../lib/types";
import { useTranslation } from "../../i18n/useTranslation";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  firebaseAvailable: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // Alias
  loginAsGuest: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a unique 6-character friend code
function generateFriendCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase is not available, just set loading to false
    if (!firebaseAvailable || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setError(null);

      if (firebaseUser && db) {
        try {
          const profileRef = doc(db, "users", firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data() as UserProfile);
          } else {
            // Create new profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              friendCode: generateFriendCode(),
              createdAt: new Date().toISOString(),
            };
            await setDoc(profileRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("Failed to fetch user profile");
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    if (!firebaseAvailable || !auth || !googleProvider) {
      console.warn(
        "Firebase is not configured. Google login is not available."
      );
      throw new Error(t("errors.cloudModeNotConfigured"));
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setError(null);
    if (!firebaseAvailable || !auth) {
      console.warn(
        "Firebase is not configured. Email/password login is not available."
      );
      throw new Error(t("errors.cloudModeNotConfigured"));
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = loginWithEmailAndPassword;

  const loginAsGuest = async () => {
    // For now, guest login just does nothing but maybe sets a local state?
    // Or we can just treat it as "not logged in" but redirect to dashboard.
    // Since this is called from Login page to bypass login, we can just resolve.
    // The app handles "no user" as guest/local mode.
    return Promise.resolve();
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    setError(null);
    if (!firebaseAvailable || !auth) {
      console.warn("Firebase is not configured. Signup is not available.");
      throw new Error(t("errors.cloudModeNotConfigured"));
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    if (!firebaseAvailable || !auth) {
      console.warn("Firebase is not configured. Logout is not needed.");
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;

    const updatedProfile = { ...userProfile, ...data };
    setUserProfile(updatedProfile);

    // If logged in with Firebase, update Firestore
    if (user && firebaseAvailable && db) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, updatedProfile, { merge: true });
      } catch (err) {
        console.error("Failed to update profile in Firestore:", err);
        // Revert local state if needed, or just log error
      }
    } else {
      // For guest users, persist to localStorage
      localStorage.setItem(
        "level_life_guest_profile",
        JSON.stringify(updatedProfile)
      );
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    firebaseAvailable,
    loginWithGoogle,
    loginWithEmailAndPassword,
    login,
    loginAsGuest,
    signup,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
