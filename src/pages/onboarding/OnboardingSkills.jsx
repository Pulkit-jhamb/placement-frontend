import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function OnboardingSkills() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const skills = [
    { id: "frontend", name: "Frontend Development", icon: "🎨" },
    { id: "backend", name: "Backend Development", icon: "⚙️" },
    { id: "fullstack", name: "Full Stack Development", icon: "<>" },
    { id: "database", name: "Database Management", icon: "🗄️" },
    { id: "cloud", name: "Cloud Computing", icon: "☁️" },
    { id: "devops", name: "DevOps", icon: "♾️" },
    { id: "ai", name: "AI / ML / DL", icon: "🧠" },
    { id: "data", name: "Data Science / Analytics", icon: "📊" },
    { id: "mobile", name: "Mobile App Development", icon: "📱" },
    { id: "uiux", name: "UI/UX Design", icon: "✏️" },
    { id: "cybersecurity", name: "Cybersecurity", icon: "🔒" },
    { id: "iot", name: "Internet of Things (IoT)", icon: "🌐" },
    { id: "blockchain", name: "Blockchain", icon: "⛓️" },
    { id: "automation", name: "AI Workflow Automation", icon: "🤖" },
  ];

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_skills");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert skill names back to IDs
        if (parsedData.skills && Array.isArray(parsedData.skills)) {
          const skillIds = parsedData.skills.map(skillName => 
            skills.find(skill => skill.name === skillName)?.id
          ).filter(Boolean);
          setSelectedSkills(skillIds);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save to localStorage whenever selectedSkills changes
  useEffect(() => {
    const selectedNames = selectedSkills.map(id => 
      skills.find(skill => skill.id === id)?.name
    ).filter(Boolean);
    if (selectedNames.length > 0) {
      localStorage.setItem("onboarding_skills", JSON.stringify({
        skills: selectedNames
      }));
    }
  }, [selectedSkills]);

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        // Remove skill if already selected
        return prev.filter(id => id !== skillId);
      } else {
        // Add skill only if less than 3 are selected
        if (prev.length >= 3) {
          setError("You can select a maximum of 3 areas of expertise");
          return prev;
        }
        setError(""); // Clear error when valid selection
        return [...prev, skillId];
      }
    });
  };

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const selectedNames = selectedSkills.map(id => 
        skills.find(skill => skill.id === id)?.name
      );
      
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "skills",
          data: {
            skills: selectedNames,
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboarding_step5", JSON.stringify({ skills: selectedNames }));
      
      navigate("/onboarding/tech-stack");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError(error.response?.data?.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/onboarding/projects");
  };

  const handleSkip = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("authToken");
      
      // Mark onboarding as complete even if skills are skipped
      await axios.post(
        API_ENDPOINTS.ONBOARDING,
        {
          step: "skills",
          data: {
            skills: [],
          },
          completed: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      localStorage.setItem("onboardingCompleted", "true");
      
      // Clear temporary onboarding data
      for (let i = 1; i <= 6; i++) {
        localStorage.removeItem(`onboarding_step${i}`);
      }

      navigate("/student/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError(error.response?.data?.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">What's Your Area of Expertise?</h1>
          <p className="text-gray-600">Select up to 3 domains that match your interests and skills</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-900"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggleSkill(skill.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSkills.includes(skill.id)
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{skill.icon}</div>
              <div className="text-sm font-medium text-gray-900">{skill.name}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
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
  );
}
