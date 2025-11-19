import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    return errors;
  };

  const validateEmail = (email) => {
    const errors = [];
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push("Invalid email address");
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate password in real-time
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordForm({ ...forgotPasswordForm, [name]: value });
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log("Google Sign In clicked");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (forgotPasswordStep === 1) {
        // Send OTP to email
        const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
          email: forgotPasswordForm.email
        });
        setSuccess("OTP sent to your email!");
        setForgotPasswordStep(2);
      } else if (forgotPasswordStep === 2) {
        // Verify OTP
        const response = await axios.post(API_ENDPOINTS.VERIFY_OTP, {
          email: forgotPasswordForm.email,
          otp: forgotPasswordForm.otp
        });
        setSuccess("OTP verified! Please enter your new password.");
        setForgotPasswordStep(3);
      } else if (forgotPasswordStep === 3) {
        // Reset password
        if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
          setError("Passwords do not match!");
          setIsLoading(false);
          return;
        }
        
        const passwordValidationErrors = validatePassword(forgotPasswordForm.newPassword);
        if (passwordValidationErrors.length > 0) {
          setError(passwordValidationErrors.join(", "));
          setIsLoading(false);
          return;
        }

        const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
          email: forgotPasswordForm.email,
          otp: forgotPasswordForm.otp,
          newPassword: forgotPasswordForm.newPassword
        });
        
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep(1);
          setForgotPasswordForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log("🚀 Login attempt started", { email: form.email });

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailValidationErrors = validateEmail(form.email);
    if (emailValidationErrors.length > 0) {
      setError(emailValidationErrors.join(", "));
      setIsLoading(false);
      return;
    }

    // Validate password format
    const passwordValidationErrors = validatePassword(form.password);
    if (passwordValidationErrors.length > 0) {
      setError(passwordValidationErrors.join(", "));
      setIsLoading(false);
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    try {
      console.log("🔗 Sending login request to:", API_ENDPOINTS.LOGIN);

      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: form.email,
        password: form.password,
      });

      console.log("✅ Login successful:", response.data);

      if (response.data.token && response.data.user) {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name || "");
        localStorage.setItem("userType", user.userType);
        
        console.log("🔐 User type:", user.userType);
        
        // For students, check onboarding completion
        if (user.userType === "student") {
          try {
            const profileResponse = await axios.get(API_ENDPOINTS.USER, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const profileData = profileResponse.data;
            
            // Check if onboarding is complete
            const onboardingCompleted = profileData.onboardingCompleted || false;
            
            localStorage.setItem("onboardingCompleted", onboardingCompleted ? "true" : "false");
            
            console.log("📋 Onboarding status:", { onboardingCompleted, profileData });
            
            setSuccess("Login successful! Redirecting...");
            
            setTimeout(() => {
              if (!onboardingCompleted) {
                console.log("🔄 Onboarding incomplete - redirecting to onboarding");
                navigate("/onboarding/start", { replace: true });
              } else {
                console.log("🏠 Navigating to student home");
                navigate("/student/home", { replace: true });
              }
            }, 100);
            
            return;
          } catch (profileError) {
            console.error("❌ Failed to fetch profile:", profileError);
            localStorage.setItem("onboardingCompleted", "false");
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
              navigate("/onboarding/start", { replace: true });
            }, 100);
            return;
          }
        } else {
          // For non-student users
          localStorage.setItem("onboardingCompleted", "true");
          setSuccess("Login successful! Redirecting...");

          let homeRoute = "/student/home";
          if (user.userType === "admin") {
            homeRoute = "/admin/home";
          } else if (user.userType === "placementCell") {
            homeRoute = "/placement-cell/home";
          } else if (user.userType === "sales") {
            homeRoute = "/sales/ai";
          }

          console.log("🏠 Navigating to:", homeRoute);

          setTimeout(() => {
            navigate(homeRoute, { replace: true });
          }, 100);
        }
      } else {
        setError("Login failed. Invalid response from server.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 403) {
        setError("Account is deactivated. Please contact support.");
      } else {
        setError(`Login failed: ${error.message || "Unknown error occurred"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>
        {/* Google Sign In Button
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors mb-6"
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
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button> */}

        {/* <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              What's your Email?
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="example@thapar.edu"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            <div className="text-right mt-2">
              <button 
                type="button" 
                className="text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                <ul className="list-disc list-inside">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-gray-900 font-semibold hover:underline bg-transparent border-none p-0"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordStep(1);
                setForgotPasswordForm({ email: "", otp: "", newPassword: "", confirmPassword: "" });
                setError("");
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {forgotPasswordStep === 1 && "Forgot Password"}
              {forgotPasswordStep === 2 && "Enter OTP"}
              {forgotPasswordStep === 3 && "Reset Password"}
            </h2>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              {forgotPasswordStep === 1 && (
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={forgotPasswordForm.email}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="example@thapar.edu"
                    required
                  />
                </div>
              )}

              {forgotPasswordStep === 2 && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={forgotPasswordForm.otp}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Check your email for the OTP</p>
                </div>
              )}

              {forgotPasswordStep === 3 && (
                <>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={forgotPasswordForm.newPassword}
                      onChange={handleForgotPasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={forgotPasswordForm.confirmPassword}
                      onChange={handleForgotPasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                    </ul>
                  </div>
                </>
              )}

              {error && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : 
                  forgotPasswordStep === 1 ? "Send OTP" :
                  forgotPasswordStep === 2 ? "Verify OTP" :
                  "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}