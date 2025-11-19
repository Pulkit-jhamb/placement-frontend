import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import AddAchievementModal from "../../components/modals/AddAchievementModal";

export default function OnboardingCertifications() {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [selectedType, setSelectedType] = useState(""); // "certification" or "achievement"
  const navigate = useNavigate();

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_step3");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAchievements(parsedData.achievements || []);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever achievements changes
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem("onboarding_step3", JSON.stringify({
        achievements
      }));
    }
  }, [achievements]);

  const handleAddAchievement = (achievementData) => {
    const updatedAchievements = [...achievements, { ...achievementData, type: selectedType }];
    setAchievements(updatedAchievements);
    setSelectedType("");
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step3", JSON.stringify({
      achievements: updatedAchievements
    }));
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
    // Save immediately to localStorage
    localStorage.setItem("onboarding_step3", JSON.stringify({
      achievements: updatedAchievements
    }));
  };

  const handleOpenModal = (type) => {
    setSelectedType(type);
    setShowTypeSelection(false);
    setIsModalOpen(true);
  };

  const handleNext = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "certifications",
          data: {
            achievements: achievements,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step3", JSON.stringify({
        achievements
      }));
      
      navigate("/onboarding/projects");
    } catch (error) {
      console.error("Error saving certifications:", error);
      setError(error.response?.data?.message || "Failed to save data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/experience");
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements & Certifications</h1>
          <p className="text-gray-600">Showcase your accomplishments</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="space-y-6">
          {/* Achievements List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Your Achievements & Certifications
            </label>
            
            {achievements.length > 0 ? (
              <div className="space-y-3 mb-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.issuer}</p>
                        {achievement.date && (
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(achievement.date)}
                          </p>
                        )}
                        {achievement.description && (
                          <p className="text-sm text-gray-700 mt-2">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No achievements added yet. Click below to add your first achievement or certification.</p>
            )}
            
            <button
              type="button"
              onClick={() => setShowTypeSelection(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add achievement or certification
            </button>
          </div>

          {/* Type Selection Popup */}
          {showTypeSelection && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What would you like to add?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleOpenModal("certification")}
                    className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <div>
                        <div className="font-semibold">Certification</div>
                        <div className="text-sm text-gray-600">Add a professional certification</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleOpenModal("achievement")}
                    className="w-full px-6 py-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <div>
                        <div className="font-semibold">Achievement</div>
                        <div className="text-sm text-gray-600">Add an accomplishment or award</div>
                      </div>
                    </div>
                  </button>
                </div>
                <button
                  onClick={() => setShowTypeSelection(false)}
                  className="w-full mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

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

      {/* Add Achievement Modal */}
      <AddAchievementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedType("");
        }}
        onSubmit={handleAddAchievement}
        type={selectedType}
      />
    </div>
  );
}
