import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../service/apiService";
import { useState } from "react";
import type { RegisterData } from "../types/auth";
import { showError, showSuccess } from "../utils/toast";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<RegisterData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // Watch fields for real-time validation
  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");

  const onSubmit = async (data: RegisterData) => {
    const { login } = useAuth()
    setServerError(null);
    try {
      const res = await authService.register(
        data.name,
        data.email,
        data.password
      );

      if (res.token) {
        login(res.token)
        showSuccess(res.message || "Account created successfully! Welcome!");
        navigate("/dashboard");
      } else if (res.message && res.message.toLowerCase().includes("success")) {
        showSuccess(res.message);
        navigate("/login");
      } else {
        const errorMsg = res.message || "Registration failed";
        setServerError(errorMsg);
        showError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setServerError(errorMsg);
      showError(errorMsg);
    }
  };

  // Check if field is valid and has content
  const isFieldValid = (fieldName: keyof RegisterData) => {
    return !errors[fieldName] && watch(fieldName)?.length > 0;
  };

  // Check specific validations
  const isNameValid = () => {
    return (
      isFieldValid("name") &&
      nameValue.length >= 2 &&
      /^[a-zA-Z\s]+$/.test(nameValue) &&
      !/\s{2,}/.test(nameValue) &&
      nameValue.trim() === nameValue
    );
  };

  const isEmailValid = () => {
    return (
      isFieldValid("email") &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue) &&
      !/\s/.test(emailValue) &&
      emailValue.trim() === emailValue
    );
  };

  const isPasswordValid = () => {
    return (
      isFieldValid("password") &&
      passwordValue.length >= 6 &&
      /[A-Z]/.test(passwordValue) &&
      /[a-z]/.test(passwordValue) &&
      /[0-9]/.test(passwordValue) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue) &&
      !/\s/.test(passwordValue) &&
      passwordValue.trim() === passwordValue
    );
  };

  const isConfirmPasswordValid = () => {
    return (
      isFieldValid("confirmPassword") && confirmPasswordValue === passwordValue
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white/60">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">
                    {serverError}
                  </p>
                </div>
              </div>
            )}

            {/* Name Input with Controller */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must be less than 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Name can only contain letters and spaces",
                  },
                  validate: {
                    noSpecialChars: (value) =>
                      /^[a-zA-Z\s]+$/.test(value) ||
                      "Name cannot contain numbers or special characters",
                    noMultipleSpaces: (value) =>
                      !/\s{2,}/.test(value) ||
                      "Name cannot have multiple consecutive spaces",
                    trimValidation: (value) =>
                      value.trim() === value ||
                      "Name cannot start or end with spaces",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.name
                            ? "border-red-500 bg-red-50"
                            : isNameValid()
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onBlur={() => trigger("name")}
                      />
                    </div>
                    {isNameValid() && (
                      <div className="flex items-center mt-1">
                        <svg
                          className="w-4 h-4 text-green-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-green-600">
                          Name looks good!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.name && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                </div>
              )}
            </div>

            {/* Email Input with Controller */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                  maxLength: {
                    value: 100,
                    message: "Email must be less than 100 characters",
                  },
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "Email cannot contain spaces",
                    validDomain: (value) =>
                      /@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value) ||
                      "Please enter a valid domain",
                    trimValidation: (value) =>
                      value.trim() === value ||
                      "Email cannot start or end with spaces",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email
                            ? "border-red-500 bg-red-50"
                            : isEmailValid()
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onBlur={() => trigger("email")}
                      />
                    </div>
                    {isEmailValid() && (
                      <div className="flex items-center mt-1">
                        <svg
                          className="w-4 h-4 text-green-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-green-600">
                          Valid email format!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.email && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                </div>
              )}
            </div>

            {/* Password Input with Controller */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 12,
                    message: "Password must be less than 12 characters",
                  },
                  validate: {
                    noSpaces: (value) =>
                      !/\s/.test(value) || "Password cannot contain spaces",
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain at least one uppercase letter",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must contain at least one lowercase letter",
                    hasNumber: (value) =>
                      /[0-9]/.test(value) ||
                      "Password must contain at least one number",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Password must contain at least one special character",
                    trimValidation: (value) =>
                      value.trim() === value ||
                      "Password cannot start or end with spaces",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        {...field}
                        type="password"
                        placeholder="Create a password"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.password
                            ? "border-red-500 bg-red-50"
                            : isPasswordValid()
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onBlur={() => trigger("password")}
                      />
                    </div>
                    {isPasswordValid() && (
                      <div className="flex items-center mt-1">
                        <svg
                          className="w-4 h-4 text-green-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-green-600">
                          Password looks good!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.password && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input with Controller */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: {
                    passwordsMatch: (value) =>
                      value === watch("password") || "Passwords do not match",
                    noSpaces: (value) =>
                      !/\s/.test(value) || "Password cannot contain spaces",
                    trimValidation: (value) =>
                      value.trim() === value ||
                      "Password cannot start or end with spaces",
                  },
                }}
                render={({ field }) => (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.confirmPassword
                            ? "border-red-500 bg-red-50"
                            : isConfirmPasswordValid()
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        }`}
                        onBlur={() => trigger("confirmPassword")}
                      />
                    </div>
                    {isConfirmPasswordValid() && (
                      <div className="flex items-center mt-1">
                        <svg
                          className="w-4 h-4 text-green-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-green-600">
                          Passwords match!
                        </span>
                      </div>
                    )}
                  </div>
                )}
              />
              {errors.confirmPassword && (
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-red-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
