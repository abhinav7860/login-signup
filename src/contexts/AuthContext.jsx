import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (name, email, password) => {
    try {
      console.log("🔥 Firebase signup starting...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase user created:", user.uid);
      
      setCurrentUser(user);

      // --- FIX: Do not await the Firestore write ---
      // This prevents the UI from hanging if Firestore rules are incorrect
      // or the network is slow. The user can be redirected immediately.
      console.log("💾 Saving user data to Firestore (in background)...");
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, { 
        name: name.trim(), 
        email: email.trim(),
        createdAt: new Date().toISOString()
      }).then(() => {
        console.log("✅ User data saved to Firestore successfully.");
      }).catch((error) => {
        console.error("❌ Error saving user data to Firestore:", error);
      });

      return user; // This now returns immediately
    } catch (error) {
      console.error("❌ Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔑 Login attempt for:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);
      console.log("✅ Login successful:", result.user.uid);
      return result;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("👋 Logging out...");
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem("authAction");
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("🔄 Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Auth state changed:", user ? `User: ${user.uid}` : "No user");
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}