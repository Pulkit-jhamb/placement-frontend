import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function OnboardingStart() {
  const [form, setForm] = useState({
    branch: "",
    year: "",
    mobile: "",
    cgpa: "",
    rollNo: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_step1");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setForm(parsedData);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  const branches = [
    "Computer Science & Engineering (COPC/COSE/COE)",
    "Computer Science and Business Systems (COBS)",
    "Electrical and Computer Engineering (EEC)",
    "Electronics and Computer Engineering (ENC)",
    "Artificial Intelligence and Machine Learning (AIML)",
    "Robotics and Artificial Intelligence (RAI)",
    "Civil Engineering with Computer Applications (CCA)",
    "Electronics & Communication Engineering (ECE)",
    "Electrical Engineering (ELE)",
    "Electronics (Instrumentation & Control) Engineering (EIC)",
    "Electronics Engineering (VLSI Design and Technology) (EVD)",
    "Mechanical Engineering (MEE)",
    "Mechatronics (MEC)",
    "Civil Engineering (CIE)",
    "Chemical Engineering (CHE)",
    "Biotechnology (BT)",
    "Biomedical Engineering (BME)"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (!form.branch || !form.year || !form.mobile || !form.cgpa || !form.rollNo) {
      setError("Please fill in all fields");
      return;
    }

    if (form.mobile.length !== 10 || !/^\d+$/.test(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (form.rollNo.length !== 9 || !/^\d+$/.test(form.rollNo)) {
      setError("Please enter a valid 9-digit roll number");
      return;
    }

    const cgpaValue = parseFloat(form.cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      setError("Please enter a valid CGPA between 0 and 10");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "basic_info",
          data: {
            field: form.branch,
            year: form.year,
            mobile: form.mobile,
            cgpa: parseFloat(form.cgpa),
            rollNo: form.rollNo,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Store in localStorage for the flow
      localStorage.setItem("onboarding_step1", JSON.stringify(form));
      navigate("/onboarding/experience");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Clear authentication to allow navigation to landing page
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's Get You Started</h1>
          <p className="text-gray-600">Tell us a bit about yourself</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="space-y-4">
          {/* <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              What's your name?
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="Enter your name as per your student ID"
              required
            />
          </div> */}

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              What's your branch of study?
            </label>
            <select
              id="branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
              required
            >
              <option value="">Select your branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              What's your year of study?
            </label>
            <select
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
              required
            >
              <option value="" disabled>Select your year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              What's your mobile no.?
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                <span className="text-gray-700">+91</span>
              </div>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                placeholder="XXXXX XXXXX"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
              What's your CGPA? (out of 10)
            </label>
            <input
              id="cgpa"
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="e.g., 8.88"
              required
            />
          </div>

          <div>
            <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
              What's your Roll Number? (9 digits)
            </label>
            <input
              id="rollNo"
              name="rollNo"
              type="tel"
              value={form.rollNo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="XXXXXXXXX"
              maxLength="9"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
