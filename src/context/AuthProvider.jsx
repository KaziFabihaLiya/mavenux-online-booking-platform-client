// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

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
      const response = await axios.post("/api/auth/token", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });

      const { token: jwtToken, user: userData } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);

      // Set user with backend data (includes role)
      setUser({
        ...firebaseUser,
        role: userData.role,
        _id: userData._id,
        isFraud: userData.isFraud,
      });

      return userData;
    } catch (error) {
      console.error("Error getting user from backend:", error);
      throw error;
    }
  };

  // Create user with email and password
  const createUser = async (email, password, name) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName: name });
      
      // Get user from backend and generate JWT
      await getUserFromBackend(result.user);
      
      return result;
    } catch (error) {
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
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
    } catch (error) {
      throw error;
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
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;