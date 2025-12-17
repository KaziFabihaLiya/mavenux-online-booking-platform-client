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
import { auth } from "../utils/firebase.config.js"; // ← ADD THIS: Import from your config
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { axiosInstance } from "../hooks/useAxiosSecure.jsx";
import toast from "react-hot-toast";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const googleProvider = new GoogleAuthProvider();

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Get user data from backend and generate JWT
const getUserFromBackend = async (firebaseUser) => {
  try {
    console.log("\n🔐 === getUserFromBackend START ===");
    console.log("Firebase user:", {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
    });

    console.log("🎫 Getting Firebase ID token...");
    const idToken = await firebaseUser.getIdToken(true);

    console.log("✅ Token obtained");
    console.log("Token length:", idToken.length);
    console.log("Token starts:", idToken.substring(0, 30));

    console.log("📤 Sending request to backend...");
    console.log("URL:", axiosInstance.defaults.baseURL + "/api/auth/token");
    console.log("Payload:", {
      token: "***" + idToken.substring(idToken.length - 20),
    });

    const response = await axiosInstance.post("/api/auth/token", {
      token: idToken,
    });

    console.log("✅ Response received:", {
      status: response.status,
      success: response.data.success,
      user: response.data.user?.email,
    });

    const { token: jwtToken, user: userData } = response.data;

    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    setUser({
      ...firebaseUser,
      ...userData,
    });

    console.log("✅ Authentication complete");
    console.log("=== getUserFromBackend END ===\n");
  } catch (error) {
    console.error("\n❌ === Authentication Error ===");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("=== Error END ===\n");

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    throw error;
  }
};

  // Create user with email and password
  const createUser = async (email, password, name) => {
    setLoading(true);
    try {
      // Step 1: Create user in Firebase
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Update profile
      await updateProfile(result.user, { displayName: name });

      // Step 3: Get user from backend and generate JWT
      await getUserFromBackend(result.user);

      // ✅ Success!
      return result;
    } catch (error) {
      console.error("Registration error:", error);

      // If Firebase registration failed, throw error
      if (error.code?.startsWith("auth/")) {
        throw error;
      }

      // If backend failed but Firebase succeeded, still let them in
      // (They can use the account, just show a warning)
      console.warn("Firebase registration succeeded but backend sync failed");
      toast.error(
        "Account created but profile sync failed. Please login again."
      );

      // Sign out from Firebase to force re-login
      await signOut(auth);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await getUserFromBackend(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await getUserFromBackend(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Log out
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Update in backend
      await axios.put("/api/auth/profile", { name, photoURL });

      // Refresh user data
      await getUserFromBackend(auth.currentUser);
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get user data from backend with role
          await getUserFromBackend(currentUser);
        } catch (error) {
          console.error("Error in auth state change:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    token,
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
