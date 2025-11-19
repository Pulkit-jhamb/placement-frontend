import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailError, setEmailError] = useState("");
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
    // Strict validation: must end with @thapar.edu
    if (!email.endsWith("@thapar.edu")) {
      return "Email must be a valid @thapar.edu address";
    }
    // Check basic email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@thapar\.edu$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    console.log(` Field updated: ${name} = "${value}"`);
    
    // Real-time validation
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
    
    if (name === "email") {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  // const handleGoogleSignUp = () => {
  //   // TODO: Implement Google OAuth
  //   console.log("Google Sign Up clicked");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    console.log(" Form submitted!");
    console.log(" Form data at submit:", form);

    // Validate email - strict @thapar.edu requirement
    const emailValidationError = validateEmail(form.email);
    if (emailValidationError) {
      setError(emailValidationError);
      setIsLoading(false);
      return;
    }

    // Validate password
    const passwordValidationErrors = validatePassword(form.password);
    if (passwordValidationErrors.length > 0) {
      setError(passwordValidationErrors.join(", "));
      setIsLoading(false);
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    try {
      console.log(" Attempting signup with:", { name: form.name, email: form.email, userType: form.userType });
      console.log(" API Endpoint:", API_ENDPOINTS.SIGNUP);
      
      const response = await axios.post(API_ENDPOINTS.SIGNUP, {
        name: form.name,
        email: form.email,
        password: form.password,
        userType: form.userType,
      });

      console.log(" Signup successful:", response.data);
      
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userType", response.data.user.userType);
        
        setSuccess("Account created successfully! Redirecting...");
        
        // For students, redirect to onboarding
        const userType = response.data.user.userType;

        if (userType === "student") {
          localStorage.setItem("onboardingCompleted", "false");
          console.log(" Redirecting student to onboarding...");
          setTimeout(() => {
            navigate("/onboarding/start");
          }, 1000);
        } else {
          // For non-student users, redirect to their respective home
          localStorage.setItem("onboardingCompleted", "true");
          let homeRoute = "/student/home";
          if (userType === "admin") {
            homeRoute = "/admin/home";
          } else if (userType === "placementCell") {
            homeRoute = "/placement-cell/home";
          } else if (userType === "sales") {
            homeRoute = "/sales/ai";
          }

          console.log(` Redirecting ${userType} to ${homeRoute}...`);
          setTimeout(() => {
            navigate(homeRoute);
          }, 1000);
        }
      } else {
        setError("Signup successful but authentication failed. Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      console.error("❌ Signup error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError(`Signup failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 relative">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join us to get started</p>
        </div>

        {/* Google Sign Up Button */}
        {/* <button
          type="button"
          onClick={handleGoogleSignUp}
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
          <span className="text-gray-700 font-medium">Sign up with Google</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>
          
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
            {emailError && (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Only @thapar.edu emails are allowed for signup</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Create a strong password
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
                autoComplete="new-password"
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
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                <ul className="list-disc list-inside">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium mb-1">Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
          </div>
          
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
              Sign up as
            </label>
            <select
              id="userType"
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
              required
            >
              <option value="student">Student</option>
              <option value="admin">Professor</option>
              {/* <option value="sales">Sales</option>
              <option value="placementCell">Placement Cell</option> */}
            </select>
          </div>

          {error && <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200">{success}</div>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign up"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Already registered? </span>
          <button
            type="button"
            className="text-gray-900 font-semibold hover:underline bg-transparent border-none p-0"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}