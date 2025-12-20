import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";
import { saveOrUpdateUser } from "../../utils";

// EXPLANATION:
// This Login component integrates with Firebase Authentication
// It handles email/password login and Google Sign-In
// Form validation ensures password requirements are met
// Error messages are displayed for user feedback

const LoginForm = () => {
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, signInWithGoogle, loading, setLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state || "/";

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to={from} replace={true} />;
  // form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      //User Login
      const { user } = await signIn(email, password);

      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });

      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    let signedInUser = null;
    try {
      // Trigger Google sign-in (provider configured to prompt account chooser)
      const result = await signInWithGoogle();
      signedInUser = result?.user;

      // Attempt to persist user in our DB; do not fail the whole flow if DB sync fails
      try {
        await saveOrUpdateUser({
          name: signedInUser?.displayName,
          email: signedInUser?.email,
          image: signedInUser?.photoURL,
          uid: signedInUser?.uid,
        });
      } catch (dbErr) {
        console.error("DB save failed, but auth ok:", dbErr);
        toast.error(
          "Logged in but failed to sync user to DB. You may need to retry."
        );
      }

      toast.success("Login successful");
    } catch (err) {
      console.error("Google sign-in error:", err);
      const errCode = err?.code || err?.message || "";

      // Friendly messages for common Firebase error codes
      if (errCode.includes("popup-closed-by-user")) {
        toast.error(
          "Sign-in popup was closed before completing. Please try again."
        );
      } else if (errCode.includes("cancelled-popup-request")) {
        toast.error("A previous popup request was cancelled. Try again.");
      } else if (errCode.includes("popup-blocked")) {
        toast.error(
          "Popup blocked by your browser. Allow popups or try incognito."
        );
      } else if (errCode.includes("account-exists-with-different-credential")) {
        toast.error(
          "An account exists with the same email using a different sign-in method. Try that provider or contact support."
        );
      } else {
        toast.error(err?.message || "Google sign-in failed. Try again.");
      }
    } finally {
      setLoading(false);
      if (signedInUser) {
        navigate(from, { replace: true });
      }
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
          <form
            onSubmit={handleSubmit}
            noValidate=""
            action=""
            className="space-y-6 ng-untouched ng-pristine ng-valid"
          >
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
                    required
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
                    autoComplete="current-password"
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
              {/* Submit Button */}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <LoadingSpinner className="animate-spin m-auto" />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
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
};
export default LoginForm;
