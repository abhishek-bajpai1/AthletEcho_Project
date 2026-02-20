"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/chat";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only set up auth listener if Firebase is configured
    if (!auth || !googleProvider) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        setUser(userData);
        upsertUserProfile(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      return {
        success: false,
        error: "Firebase is not configured. Please set up your .env.local file. See FIREBASE_SETUP.md for instructions.",
      };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      const user = result.user;
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      router.push("/home");
      return { success: true };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return {
        success: false,
        error: error.message || "Failed to sign in with Google",
      };
    }
  };

  const logout = async () => {
    if (!auth) {
      setUser(null);
      router.push("/");
      return { success: true };
    }

    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
