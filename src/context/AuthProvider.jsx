// src/contexts/AuthProvider.jsx
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase.config.js";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();
// Always prompt account selection to avoid silently signing into a cached account
googleProvider.setCustomParameters({ prompt: "select_account" });

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // ensure the provider prompts account chooser each time
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (err) {
      throw err;
    } finally {
      // Ensure loading state is turned off for UI
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      const res = await signOut(auth);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  // observe user state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log(currentUser);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
