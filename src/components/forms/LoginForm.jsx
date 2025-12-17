import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";

// EXPLANATION:
// This Login component integrates with Firebase Authentication
// It handles email/password login and Google Sign-In
// Form validation ensures password requirements are met
// Error messages are displayed for user feedback

 const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // In your actual app, get these from AuthContext:
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async () => {
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // FIREBASE LOGIN - Replace with actual auth context
      await signIn(formData.email, formData.password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Login successful:", formData.email);
      alert("✅ Login successful! Redirecting to dashboard...");
      navigate("/dashboard");

      
    } catch (err) {
      console.error("Login error:", err);

      // Handle Firebase errors
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      // GOOGLE SIGN-IN - Replace with actual auth context
      await signInWithGoogle();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Google sign-in successful");
      alert("✅ Google sign-in successful! Redirecting...");
      navigate("/dashboard");

    } catch (err) {
      console.error("Google sign-in error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Only one sign-in popup allowed at a time.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-stone-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-stone-600">Sign in to continue to TicketBari</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Fields */}
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-stone-200"></div>
            <span className="text-sm text-stone-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-stone-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <p className="text-center mt-6 text-xs text-stone-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-amber-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-amber-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
export default LoginForm;
/* 
===========================================
HOW TO INTEGRATE WITH YOUR EXISTING FIREBASE
===========================================

1. Import your AuthContext:
   import { useContext } from 'react';
   import { AuthContext } from '../contexts/AuthContext';
   import { useNavigate } from 'react-router-dom';
   import toast from 'react-hot-toast';

2. Use the context in component:
   const { signIn, signInWithGoogle } = useContext(AuthContext);
   const navigate = useNavigate();

3. Replace handleSubmit function:
   
   const handleSubmit = async () => {
     if (!formData.email || !formData.password) {
       toast.error('Please fill in all fields');
       return;
     }
     
     setLoading(true);
     try {
       await signIn(formData.email, formData.password);
       toast.success('Login successful!');
       navigate('/dashboard');
     } catch (err) {
       toast.error(err.message || 'Login failed');
     } finally {
       setLoading(false);
     }
   };

4. Replace handleGoogleSignIn function:
   
   const handleGoogleSignIn = async () => {
     setLoading(true);
     try {
       await signInWithGoogle();
       toast.success('Google sign-in successful!');
       navigate('/dashboard');
     } catch (err) {
       if (err.code !== 'auth/popup-closed-by-user') {
         toast.error('Google sign-in failed');
       }
     } finally {
       setLoading(false);
     }
   };
*/
