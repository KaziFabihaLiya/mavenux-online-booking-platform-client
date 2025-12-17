import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Image,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";

// EXPLANATION:
// This Register component creates new user accounts with Firebase
// It validates password requirements (uppercase, lowercase, 6+ chars)
// Shows real-time password strength feedback
// Handles both email/password and Google authentication

const  RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasMinLength: false,
  });

  // In actual app:
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");

    // Real-time password validation
    if (name === "password") {
      setPasswordValidation({
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasMinLength: value.length >= 6,
      });
    }
  };

  const validatePassword = () => {
    const { password } = formData;

    if (!password) {
      setError("Password is required");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      // FIREBASE REGISTRATION 
      // 1. Create user
      await createUser(formData.email, formData.password);

      // 2. Update profile with name and photo
      await updateUserProfile(formData.name, formData.photoURL);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration successful:", formData);
      alert("✅ Registration successful! Welcome to TicketBari!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Registration error:", err);

      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Registration failed. Please try again.");
        console.error("Full error details:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      // GOOGLE SIGN-UP - Replace with actual auth context
      await signInWithGoogle();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Google sign-up successful");
      alert("✅ Google sign-up successful! Welcome!");
      navigate("/dashboard");

      // In actual app: navigate('/dashboard');
    } catch (err) {
      console.error("Google sign-up error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-up cancelled.");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account with this email already exists.");
      } else {
        setError("Google sign-up failed. Please try again.");
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

  const isPasswordValid =
    passwordValidation.hasUppercase &&
    passwordValidation.hasLowercase &&
    passwordValidation.hasMinLength;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-stone-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              Create Account
            </h1>
            <p className="text-stone-600">Join TicketBari today</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Registration Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address <span className="text-red-500">*</span>
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

            {/* Photo URL Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Photo URL{" "}
                <span className="text-stone-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Create a strong password"
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

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasUppercase ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                    )}
                    <span
                      className={
                        passwordValidation.hasUppercase
                          ? "text-green-700"
                          : "text-stone-600"
                      }
                    >
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasLowercase ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                    )}
                    <span
                      className={
                        passwordValidation.hasLowercase
                          ? "text-green-700"
                          : "text-stone-600"
                      }
                    >
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordValidation.hasMinLength ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                    )}
                    <span
                      className={
                        passwordValidation.hasMinLength
                          ? "text-green-700"
                          : "text-stone-600"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || (formData.password && !isPasswordValid)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-stone-200"></div>
            <span className="text-sm text-stone-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>

          {/* Google Sign-Up Button */}
          <button
            onClick={handleGoogleSignUp}
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

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <p className="text-center mt-6 text-xs text-stone-500">
          By signing up, you agree to our{" "}
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
export default RegisterForm;