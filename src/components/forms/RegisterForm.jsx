import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { imageUpload, saveOrUpdateUser } from "../../utils";
import { useForm } from "react-hook-form";


const  RegisterForm = () => {
  const {
    user, 
    createUser,
    signInWithGoogle,
    updateUserProfile,
    loading,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate();
const location = useLocation();
const from = location.state || "/";

// React Hook Form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

console.log(errors);
const onSubmit = async (data) => {
  const { name, image, email, password } = data;
  const imageFile = image[0];
  // const formData = new FormData()
  // formData.append('image', imageFile)

  try {
    // const { data } = await axios.post(
    //   `https://api.imgbb.com/1/upload?key=${
    //     import.meta.env.VITE_IMGBB_API_KEY
    //   }`,
    //   formData
    // )
    const imageURL = await imageUpload(imageFile);
    // const cloudinaryImageUrl = await imageUploadCloudinary(imageFile)
    // console.log('Cloudinary Response ----->', cloudinaryImageUrl)

    //1. User Registration
    const result = await createUser(email, password);

    await saveOrUpdateUser({ name, email, image: imageURL });

    // 2. Generate image url from selected file

    //3. Save username & profile photo
    await updateUserProfile(name, imageURL);

    navigate(from, { replace: true });
    toast.success("Signup Successful");

    console.log(result);
  } catch (err) {
    console.log(err);
    toast.error(err?.message);
  }
};

    const handleGoogleSignIn = async () => {
      try {
        //User Registration using google
        const { user } = await signInWithGoogle();

        await saveOrUpdateUser({
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
          uid: user?.uid,
        });

        navigate(from, { replace: true });
        toast.success("Signup Successful");
      } catch (err) {
        toast.error(err.message);
      } finally {
        if (user) navigate(from);
      }
    };

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate=""
            action=""
            className="space-y-6 ng-untouched ng-pristine ng-valid"
          >
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
                    {...register("name", {
                      required: "Name is required",
                      maxLength: {
                        value: 20,
                        message: "Name cannot be too long",
                      },
                    })}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />{" "}
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
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
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter Your Email Here"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                    className="w-full pl-11 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />{" "}
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Photo URL Field */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Photo URL{" "}
                  <span className="text-stone-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  
                  <input
                    name="image"
                    type="file"
                    id="image"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 px-3
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-orange-50 file:text-orange-700
      hover:file:bg-orange-100
      bg-gray-100 border border-dashed border-orange-300 rounded-md cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
      py-2"
                    {...register("image")}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG or JPEG (max 2MB)
                  </p>
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
                    autoComplete="new-password"
                    id="password"
                    placeholder="*******"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full pl-11 pr-11 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />{" "}
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
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
                type="submit"
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
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-stone-200"></div>
            <span className="text-sm text-stone-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>

          {/* Google Sign-Up Button */}
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