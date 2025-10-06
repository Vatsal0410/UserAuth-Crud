import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../service/apiService";
import { useState } from "react";
import { showError } from "../utils/toast";
import { useAuth } from "../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // for real-time validation
  const emailValue = watch("email");
  const passwordValue = watch("password");

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const res = await authService.login(data.email, data.password);
      if (!res.token) {
        setServerError(res.message || "Login failed");
        return;
      }
      login(res.token);
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setServerError(errorMsg);
      showError(errorMsg);
    }
  };

  // Check if field is valid and has content
  const isFieldValid = (fieldName: keyof LoginFormData) => {
    return !errors[fieldName] && watch(fieldName)?.length > 0;
  };

  // Check specific validations
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
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
                // In the password Controller rules - REPLACE the current rules with:
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Password must be less than 50 characters",
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
                        placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
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
                      d="M13 16l4-4m0 0l-4-4m4 4H3m5 4v1a3 3 0 003 3h7a3 3 0 003-3V7a3 3 0 00-3-3H8a3 3 0 00-3 3v1"
                    />
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
