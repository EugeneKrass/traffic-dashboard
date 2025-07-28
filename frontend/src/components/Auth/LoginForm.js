import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { User, Lock } from "lucide-react";
import {
  loginUser,
  registerUser,
  selectAuthError,
  clearError,
} from "../../redux/slices/authSlice";
import { Button } from "../UI";
import { VALIDATION_RULES } from "../../utils/constants";

/**
 * Login/Register form component
 * Handles both sign in and sign up functionality
 */
export const LoginForm = () => {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  /**
   * Handle form submission
   * @param {Object} data - Form data { email, password }
   */
  const onSubmit = async (data) => {
    dispatch(clearError());

    try {
      if (isLoginMode) {
        await dispatch(loginUser(data)).unwrap();
      } else {
        await dispatch(registerUser(data)).unwrap();
      }
    } catch (error) {
      // Error is handled in Redux slice
      console.error("Auth error:", error);
    }
  };

  /**
   * Toggle between login and register modes
   */
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Form Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Traffic Dashboard
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                {...register("email", VALIDATION_RULES.email)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                {...register("password", VALIDATION_RULES.password)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : isLoginMode
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>

        {/* Mode Toggle */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLoginMode
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLoginMode ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};
