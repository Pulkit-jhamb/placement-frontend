import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import AddExperienceModal from "../../components/modals/AddExperienceModal";

export default function OnboardingExperience() {
  const [experiences, setExperiences] = useState([]);
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_step2");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setExperiences(parsedData.experiences || []);
        setLinkedinProfile(parsedData.linkedinProfile || "");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever experiences or linkedinProfile changes
  useEffect(() => {
    if (experiences.length > 0 || linkedinProfile) {
      localStorage.setItem("onboarding_step2", JSON.stringify({
        experiences,
        linkedinProfile
      }));
    }
  }, [experiences, linkedinProfile]);

  const handleAddExperience = (experienceData) => {
    const updatedExperiences = [...experiences, experienceData];
    setExperiences(updatedExperiences);
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step2", JSON.stringify({
      experiences: updatedExperiences,
      linkedinProfile
    }));
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step2", JSON.stringify({
      experiences: updatedExperiences,
      linkedinProfile
    }));
  };


  const handleNext = async () => {
    // Validate LinkedIn URL only if provided
    if (linkedinProfile.trim()) {
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub|company)\/[a-zA-Z0-9_-]+\/?$/;
      if (!linkedinRegex.test(linkedinProfile.trim())) {
        setError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "experiences",
          data: {
            experiences: experiences,
            linkedinProfile: linkedinProfile,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step2", JSON.stringify({
        experiences,
        linkedinProfile
      }));
      
      navigate("/onboarding/certifications");
    } catch (error) {
      console.error("Error saving achievements:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/start");
  };

  const handleSkip = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        { completed: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("onboardingCompleted", "true");
      navigate("/student/home", { replace: true });
    } catch (err) {
      console.error("Error skipping onboarding:", err);
      setError(err.response?.data?.message || "Failed to skip onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Work Experience</h1>
          <p className="text-gray-600">Share your professional experiences</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="space-y-6">
          {/* Experiences List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Your Work Experience
            </label>
            
            {experiences.length > 0 ? (
              <div className="space-y-3 mb-4">
                {experiences.map((experience, index) => (
                  <div key={index} className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                        <p className="text-sm text-gray-600">{experience.company}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {experience.employmentType && (
                      <p className="text-sm text-gray-600 mb-1">{experience.employmentType}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {experience.startMonth && experience.startYear && (
                        <span>
                          {new Date(2000, experience.startMonth - 1).toLocaleString('default', { month: 'short' })} {experience.startYear}
                        </span>
                      )}
                      {" - "}
                      {experience.currentlyWorking ? (
                        <span>Present</span>
                      ) : (
                        experience.endMonth && experience.endYear && (
                          <span>
                            {new Date(2000, experience.endMonth - 1).toLocaleString('default', { month: 'short' })} {experience.endYear}
                          </span>
                        )
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No experiences added yet. Click below to add your first experience.</p>
            )}
            
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add experience
            </button>
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              Share your LinkedIn profile link (optional)
            </label>
            <input
              id="linkedin"
              type="url"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              placeholder="https://linkedin.com/in/yourprofile"
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
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExperience}
      />
    </div>
  );
}
